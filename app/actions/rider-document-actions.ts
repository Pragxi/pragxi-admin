'use server';

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames

// Define the Zod schema for validation.
// For file uploads via FormData, the server action will receive `File` objects.
// However, when passing from client to server action, it's safer to deal with
// string paths after upload or handle the FormData directly on the server.
// Since we are uploading to Supabase Storage, we will handle the file objects
// received directly from the FormData in the server action.
const formSchema = z.object({
    id_card: z.any().refine(files => files.length > 0, "At least one ID card file is required."),
    drivers_license: z.any().refine(files => files.length > 0, "At least one driver's license file is required."),
    insurance: z.any().refine(files => files.length > 0, "At least one insurance file is required."),
});

// Helper function to upload a single file to Supabase Storage
async function uploadFileToSupabase(supabase: any, file: File, bucketPath: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`; // Generate a unique filename
    const filePath = `${bucketPath}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('rider_documents') // Your Supabase storage bucket name
        .upload(filePath, file, {
            upsert: false // Set to true if you want to overwrite existing files with the same name
        });

    if (uploadError) {
        console.error(`Error uploading ${file.name} to ${bucketPath}:`, uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Get public URL or internal path if needed. For now, returning internal path.
    // If you need a public URL, you'd typically get it like this:
    // const { data: publicUrlData } = supabase.storage.from('rider-documents').getPublicUrl(filePath);
    // return publicUrlData.publicUrl;
    return filePath;
}

export async function createRiderDocuments(formData: FormData) {
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

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("Auth error:", userError);
            return { error: "Authentication required" };
        }

        const idCardFiles = formData.getAll('id_card') as File[];
        const driversLicenseFiles = formData.getAll('drivers_license') as File[];
        const insuranceFiles = formData.getAll('insurance') as File[];

        // Basic validation for presence of files
        if (idCardFiles.length === 0) {
            return { error: "At least one ID card file is required." };
        }
        if (driversLicenseFiles.length === 0) {
            return { error: "At least one driver's license file is required." };
        }
        if (insuranceFiles.length === 0) {
            return { error: "At least one insurance file is required." };
        }

        // Upload files and collect their paths
        const uploadedIdCardPaths = await Promise.all(
            idCardFiles.map(file => uploadFileToSupabase(supabase, file, 'id-cards'))
        );
        const uploadedDriversLicensePaths = await Promise.all(
            driversLicenseFiles.map(file => uploadFileToSupabase(supabase, file, 'drivers-licenses'))
        );
        const uploadedInsurancePaths = await Promise.all(
            insuranceFiles.map(file => uploadFileToSupabase(supabase, file, 'insurance'))
        );

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
            console.error("Supabase insert error:", dbError);
            return { error: dbError.message };
        }

        return { success: true };
    } catch (error) {
        console.error("Error in createRiderDocuments:", error);
        return { error: "Failed to upload documents." };
    }
}
