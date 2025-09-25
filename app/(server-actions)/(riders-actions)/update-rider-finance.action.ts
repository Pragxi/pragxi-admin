"use server";

import {createClient} from "@/utils/supabase/server";
import {RiderFinanceSchema} from "@/types/rider";
import * as z from "zod";

export const updateRiderFinanceAction = async (riderId: string, formData: z.infer<typeof RiderFinanceSchema>) => {
    const parsedData = RiderFinanceSchema.safeParse(formData);

    if (!parsedData.success) {
        return {
            success: false,
            error: "Invalid form data",
            issues: parsedData.error.issues,
        };
    }

    const supabase = await createClient();

    try {
        const payload = {
            service_provider: parsedData.data.service_provider,
            mobile_money_number: parsedData.data.mobile_money_number,
        };

        // Try update first
        const { error: updateError, data: updateResult } = await supabase
            .from('riders_financial_information')
            .update(payload)
            .eq('rider_id', riderId)
            .select();

        if (updateError) {
            console.log("Failed to update rider finance:", updateError.message);
            return {
                success: false,
                error: "Failed to update rider finance information - please try again later",
            };
        }

        // If no row was updated, insert a new one
        if (!updateResult || updateResult.length === 0) {
            const { error: insertError, data: insertResult } = await supabase
                .from('riders_financial_information')
                .insert({
                    rider_id: riderId,
                    ...payload,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select();

            if (insertError) {
                console.log("Failed to insert rider finance:", insertError.message);
                return {
                    success: false,
                    error: "Failed to create rider finance information - please try again later",
                };
            }
        }

        return {
            success: true,
            data: {
                rider_id: riderId,
                message: "Rider finance information updated successfully"
            },
        };

    } catch (error) {
        console.error("Error updating rider finance information:", error);
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        };
    }
}; 