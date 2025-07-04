'use server';

import * as z from "zod";
import {createClient} from "@/utils/supabase/server";
import {RiderSecuritySchema} from "@/types/rider";

export async function createRiderSecurityInformation(formData: z.infer<typeof RiderSecuritySchema>) {
    console.log("Server action: createRiderSecurityInformation started.");
    try {
        const supabase = await createClient();
        console.log("Server action: Supabase client created.");

        // Server-side validation
        const validatedData = RiderSecuritySchema.safeParse(formData);
        if (!validatedData.success) {
            return {
                success: false,
                error: "Invalid form data",
                issues: validatedData.error.issues,
            };
        }

        console.log("Server action: Form data validated.", validatedData);

        const {error} = await supabase
            .from('riders_security_information')
            .insert({
                rider_id: validatedData.data.rider_id,
                vehicle: validatedData.data.vehicle,
                vehicle_number: validatedData.data.vehicle_number,
                vehicle_color: validatedData.data.vehicle_color,
                id_number: validatedData.data.id_number,
                drivers_license_number: validatedData.data.drivers_license_number,
                insurance_type: validatedData.data.insurance_type,
                insurance_number: validatedData.data.insurance_number,
                insurance_expiration_date: validatedData.data.insurance_expiration.toISOString().split('T')[0],
                witness_name: validatedData.data.witness_name,
                witness_relationship: validatedData.data.relationship,
                witness_phone_number: validatedData.data.witness_contact_number,
            });

        if (error) {
            console.error("Server action: Supabase insert error:", error);
            return {error: error.message};
        }
        console.log("Server action: Data inserted successfully.");

        return {success: true};
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Server action: Zod validation error:", error.errors);
            return {error: "Validation failed: " + error.errors.map(e => e.message).join(', ')};
        }
        console.error("Server action: Unexpected error in createRiderSecurityInformation:", error);
        return {error: "Failed to save security information."};
    }
}

export async function updateRiderSecurityInformation(formData: z.infer<typeof RiderSecuritySchema>, riderId: string) {
    console.log("Server action: updateRiderSecurityInformation started.");
    try {
        const supabase = await createClient();
        console.log("Server action: Supabase client created.");

        // Server-side validation
        const validatedData = RiderSecuritySchema.safeParse(formData);
        if (!validatedData.success) {
            return {
                success: false,
                error: "Invalid form data",
                issues: validatedData.error.issues,
            };
        }

        console.log("Server action: Form data validated.", validatedData);

        const {error: securityError} = await supabase
            .from('riders_security_information')
            .update({
                vehicle: validatedData.data.vehicle,
                vehicle_number: validatedData.data.vehicle_number,
                vehicle_color: validatedData.data.vehicle_color,
                id_number: validatedData.data.id_number,
                drivers_license_number: validatedData.data.drivers_license_number,
                insurance_type: validatedData.data.insurance_type,
                insurance_number: validatedData.data.insurance_number,
                insurance_expiration_date: validatedData.data.insurance_expiration.toISOString().split('T')[0],
                witness_name: validatedData.data.witness_name,
                witness_relationship: validatedData.data.relationship,
                witness_phone_number: validatedData.data.witness_contact_number,
            })
            .eq('rider_id', riderId);

        if (securityError) {
            console.error("Server action: Supabase update error:", securityError);
            return {error: securityError.message};
        }
        console.log("Server action: Data updated successfully.");

        return {success: true};
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Server action: Zod validation error:", error.errors);
            return {error: "Validation failed: " + error.errors.map(e => e.message).join(', ')};
        }
        console.error("Server action: Unexpected error in updateRiderSecurityInformation:", error);
        return {error: "Failed to update security information."};
    }
}