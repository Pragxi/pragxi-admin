'use server';

import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

async function uploadFileToSupabase(supabase: SupabaseClient, file: File, bucketPath: string, sectionName: string, rider_id: string) {
    const bucketName = 'rider-documents';
    const fileExt = file.name.split('.').pop();
    const fileName = `${sectionName}_${rider_id}.${fileExt}`;
    const filePath = `${bucketPath}/${rider_id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
            upsert: true
        });

    if (uploadError) {
        console.error(`Error uploading ${file.name} to ${bucketPath}:`, uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file.");
    }

    return { publicUrl: publicUrlData.publicUrl, path: filePath };
}

async function deleteUploadedFiles(supabase: SupabaseClient, paths: string[]) {
    if (paths.length === 0) return;
    const { error } = await supabase.storage.from('rider-documents').remove(paths);
    if (error) {
        console.error("Error deleting files during rollback:", error);
    }
}

export async function createRiderDocuments(formData: FormData) {
    const rider_id = formData.get('rider_id') as string;
    const uploadedPaths: string[] = [];

    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return { error: "Authentication required to upload documents." };
        }

        const idCardFiles = formData.getAll('id_card') as File[];
        const driversLicenseFiles = formData.getAll('drivers_license') as File[];
        const insuranceFiles = formData.getAll('insurance') as File[];

        if (idCardFiles.length === 0 || driversLicenseFiles.length === 0 || insuranceFiles.length === 0) {
            return { error: "All document types are required." };
        }

        const uploadedIdCardData = await Promise.all(
            idCardFiles.map(file => uploadFileToSupabase(supabase, file, 'id-cards', 'id-card', rider_id))
        );
        const uploadedDriversLicenseData = await Promise.all(
            driversLicenseFiles.map(file => uploadFileToSupabase(supabase, file, 'drivers-licenses', 'drivers-license', rider_id))
        );
        const uploadedInsuranceData = await Promise.all(
            insuranceFiles.map(file => uploadFileToSupabase(supabase, file, 'insurance', 'insurance', rider_id))
        );

        // Collect all file paths for potential cleanup
        uploadedPaths.push(
            ...uploadedIdCardData.map(f => f.path),
            ...uploadedDriversLicenseData.map(f => f.path),
            ...uploadedInsuranceData.map(f => f.path)
        );

        const { error: dbError } = await supabase
            .from('riders_document_information')
            .insert({
                rider_id: rider_id,
                id_card_paths: uploadedIdCardData.map(f => f.publicUrl),
                drivers_license_paths: uploadedDriversLicenseData.map(f => f.publicUrl),
                insurance_paths: uploadedInsuranceData.map(f => f.publicUrl),
            });

        if (dbError) {
            await deleteUploadedFiles(supabase, uploadedPaths);
            return { error: `Failed to save document information: ${dbError.message}` };
        }

        return { success: true };
    } catch (error) {
        console.error("Unexpected error:", error);
        if (uploadedPaths.length > 0) {
            const supabase = await createClient();
            await deleteUploadedFiles(supabase, uploadedPaths);
        }
        return { error: "Failed to upload documents due to an unexpected error." };
    }
}
