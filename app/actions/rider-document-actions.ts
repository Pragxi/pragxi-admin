'use server';

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';

// Define the Zod schema for validation.
// For file uploads via FormData, the server action will receive `File` objects.

const formSchema = z.object({
    id_card: z.any().refine(files => files.length > 0, "At least one ID card file is required."),
    drivers_license: z.any().refine(files => files.length > 0, "At least one driver's license file is required."),
    insurance: z.any().refine(files => files.length > 0, "At least one insurance file is required."),
});

// Helper function to upload a single file to Supabase Storage and return its public URL
async function uploadFileToSupabase(supabase: any, file: File, bucketPath: string, sectionName: string) {
    const bucketName = 'rider_documents'; // Explicitly define bucket name here for logging
    console.log(`Attempting to upload to bucket: ${bucketName} at path: ${bucketPath}`); // Added log

    const fileExt = file.name.split('.').pop();
    const fileName = `${sectionName}_${uuidv4()}.${fileExt}`;
    const filePath = `${bucketPath}/${fileName}`;

    console.log(`Uploading file: ${fileName} to bucket path: ${filePath}`);

    const { error: uploadError } = await supabase.storage
        .from('rider_documents') // Your Supabase storage bucket name
        .upload(filePath, file, {
            upsert: false
        });

    if (uploadError) {
        console.error(`Error uploading ${file.name} to ${bucketPath}:`, uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
        console.error("Failed to get public URL for file:", filePath);
        throw new Error("Failed to get public URL for uploaded file.");
    }

    console.log(`File uploaded. Public URL: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
}

export async function createRiderDocuments(formData: FormData) {
    console.log("Server action: createRiderDocuments started.");
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set(name, value, options);
                    },
                    remove(name: string, options: any) {
                        cookieStore.set(name, '', options);
                    },
                },
            }
        );
        console.log("Server action: Supabase client created for documents.");

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("Server action: Auth error in document upload:", userError);
            return { error: "Authentication required to upload documents." };
        }
        console.log("Server action: User found for document upload:", user.id);

        const idCardFiles = formData.getAll('id_card') as File[];
        const driversLicenseFiles = formData.getAll('drivers_license') as File[];
        const insuranceFiles = formData.getAll('insurance') as File[];

        if (idCardFiles.length === 0) {
            return { error: "At least one ID card file is required." };
        }
        if (driversLicenseFiles.length === 0) {
            return { error: "At least one driver's license file is required." };
        }
        if (insuranceFiles.length === 0) {
            return { error: "At least one insurance file is required." };
        }

        console.log("Server action: Starting file uploads...");
        const uploadedIdCardPaths = await Promise.all(
            idCardFiles.map(file => uploadFileToSupabase(supabase, file, 'id-cards', 'id-card'))
        );
        const uploadedDriversLicensePaths = await Promise.all(
            driversLicenseFiles.map(file => uploadFileToSupabase(supabase, file, 'drivers-licenses', 'drivers-license'))
        );
        const uploadedInsurancePaths = await Promise.all(
            insuranceFiles.map(file => uploadFileToSupabase(supabase, file, 'insurance', 'insurance'))
        );
        console.log("Server action: All files uploaded and public URLs retrieved.");

        const { error: dbError } = await supabase
            .from('rider_documents')
            .insert([
                {
                    rider_id: user.id,
                    id_card_paths: uploadedIdCardPaths,
                    drivers_license_paths: uploadedDriversLicensePaths,
                    insurance_paths: uploadedInsurancePaths,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]);

        if (dbError) {
            console.error("Server action: Supabase database insert error for documents:", dbError);
            return { error: `Failed to save document information to database: ${dbError.message}` };
        }
        console.log("Server action: Document paths inserted into database successfully.");

        return { success: true };
    } catch (error) {
        console.error("Server action: Unexpected error in createRiderDocuments:", error);
        return { error: "Failed to upload documents due to an unexpected error." };
    }
}
