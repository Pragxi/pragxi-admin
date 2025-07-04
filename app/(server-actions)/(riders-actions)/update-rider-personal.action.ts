"use server";

import {createClient} from "@/utils/supabase/server";
import {RiderInfoSchema} from "@/types/rider";
import * as z from "zod";

export const updateRiderPersonalAction = async (riderId: string, formData: z.infer<typeof RiderInfoSchema>) => {
    console.log("Update rider action called with:", { riderId, formData });
    
    if (!riderId) {
        console.log("No rider ID provided");
        return {
            success: false,
            error: "Rider ID is required",
        };
    }

    const rawFormData = formData;

    const parsedData = RiderInfoSchema.safeParse({
        ...rawFormData,
    });

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

        // Update rider personal information
        const updateData = {
            first_name: parsedData.data.first_name,
            last_name: parsedData.data.last_name,
            phone_number: parsedData.data.phone_number,
            email: parsedData.data.email,
            dob: parsedData.data.dob.toISOString(),
            marital_status: parsedData.data.marital_status,
            gender: parsedData.data.gender,
            city: parsedData.data.city,
            nationality: parsedData.data.nationality,
            gps_address: parsedData.data.gps_address,
        };

        console.log("Attempting to update with data:", updateData);
        console.log("Looking for rider_id:", riderId);

        const {error: riderError, data: updateResult} = await supabase
            .from('riders_personal_information')
            .update(updateData)
            .eq('rider_id', riderId)
            .select();

        console.log("Update result:", { updateResult, riderError });

        if (riderError) {
            console.log("Failed to update rider:", riderError.message);
            console.log("Error details:", riderError);
            return {
                success: false,
                error: "Failed to update rider - please try again later",
            };
        }

        console.log("Update successful:", updateResult);

        return {
            success: true,
            data: {
                rider_id: riderId,
                message: "Rider personal information updated successfully"
            },
        };

    } catch (error) {
        console.error("Error updating rider personal information:", error);
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        };
    }
}; 