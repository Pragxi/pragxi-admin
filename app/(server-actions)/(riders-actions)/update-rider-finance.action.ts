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
        // Update rider finance information
        const {error: financeError} = await supabase
            .from('riders_finance_information')
            .update({
                service_provider: parsedData.data.service_provider,
                mobile_money_number: parsedData.data.mobile_money_number,
            })
            .eq('rider_id', riderId);

        if (financeError) {
            console.log("Failed to update rider finance:", financeError.message);
            return {
                success: false,
                error: "Failed to update rider finance information - please try again later",
            };
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