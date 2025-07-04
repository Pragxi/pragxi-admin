"use server";

import {createClient} from "@/utils/supabase/server";
import {RiderSecuritySchema} from "@/types/rider";
import * as z from "zod";

export const updateRiderSecurityAction = async (riderId: string, formData: z.infer<typeof RiderSecuritySchema>) => {
    console.log("Update rider security action called with:", { riderId, formData });

    if (!riderId) {
        console.log("No rider ID provided");
        return {
            success: false,
            error: "Rider ID is required",
        };
    }

    const parsedData = RiderSecuritySchema.safeParse(formData);

    if (!parsedData.success) {
        console.log("Validation failed:", parsedData.error.issues);
        return {
            success: false,
            error: "Invalid form data",
            issues: parsedData.error.issues,
        };
    }

    console.log("Validation passed, parsed data:", parsedData.data);

    try {
        const supabase = await createClient();

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.log("Authentication error:", authError);
            return {
                success: false,
                error: "Authentication required",
            };
        }

        // Update rider security information
        const updateData = {
            vehicle: parsedData.data.vehicle,
            vehicle_number: parsedData.data.vehicle_number,
            vehicle_color: parsedData.data.vehicle_color,
            id_number: parsedData.data.id_number,
            drivers_license_number: parsedData.data.drivers_license_number,
            insurance_type: parsedData.data.insurance_type,
            insurance_number: parsedData.data.insurance_number,
            insurance_expiration_date: parsedData.data.insurance_expiration?.toISOString().split('T')[0],
            witness_name: parsedData.data.witness_name,
            witness_relationship: parsedData.data.relationship,
            witness_phone_number: parsedData.data.witness_contact_number,
        };

        console.log("Attempting to update with data:", updateData);
        console.log("Looking for rider_id:", riderId);

        const { error: securityError, data: updateResult } = await supabase
            .from('riders_security_information')
            .update(updateData)
            .eq('rider_id', riderId)
            .select();

        console.log("Update result:", { updateResult, securityError });

        if (securityError) {
            console.log("Failed to update rider security:", securityError.message);
            console.log("Error details:", securityError);
            return {
                success: false,
                error: "Failed to update rider security information - please try again later",
            };
        }

        console.log("Update successful:", updateResult);

        return {
            success: true,
            data: {
                rider_id: riderId,
                message: "Rider security information updated successfully"
            },
        };

    } catch (error) {
        console.error("Error updating rider security information:", error);
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        };
    }
}; 