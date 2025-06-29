'use server';

import * as z from "zod";
import {createClient} from "@/utils/supabase/server";
import {RiderFinanceSchema} from "@/types/rider";


export async function createRiderFinanceInformation(formData: z.infer<typeof RiderFinanceSchema>) {
    try {
        const supabase = await createClient();

        const validatedData = RiderFinanceSchema.safeParse(formData);

        if (!validatedData.success) {
            return {
                success: false,
                error: "Invalid form data",
                issues: validatedData.error.issues,
            };
        }

        const {error} = await supabase
            .from('riders_financial_information')
            .insert({
                rider_id: validatedData.data.rider_id,
                service_provider: validatedData.data.service_provider,
                mobile_money_number: validatedData.data.mobile_money_number,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error("Supabase insert error:", error);
            return {error: error.message};
        }

        return {success: true};
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {error: "Validation failed: " + error.errors.map(e => e.message).join(', ')};
        }
        console.error("Error in createRiderFinanceInformation:", error);
        return {error: "Failed to save financial information."};
    }
}
