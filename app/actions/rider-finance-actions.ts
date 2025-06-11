'use server';

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import * as z from "zod";

const formSchema = z.object({
    service_provider: z.string().min(1, "Service provider is required"),
    mobile_money_number: z.string().min(1, "Mobile money number is required")
        .regex(/^\d+$/, "Must contain only numbers"),
});

export async function createRiderFinanceInformation(formData: z.infer<typeof formSchema>) {
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

        const validatedData = formSchema.parse(formData);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("Auth error:", userError);
            return { error: "Authentication required" };
        }

        const { error } = await supabase
            .from('riders_financial_information')
            .insert([
                {
                    rider_id: user.id,
                    ...validatedData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error("Supabase insert error:", error);
            return { error: error.message };
        }

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: "Validation failed: " + error.errors.map(e => e.message).join(', ') };
        }
        console.error("Error in createRiderFinanceInformation:", error);
        return { error: "Failed to save financial information." };
    }
}
