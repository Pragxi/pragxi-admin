'use server';

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import * as z from "zod";
import { toast } from "sonner"; // It's better to use toast in client components, but for now, we'll keep it here.

// Define the Zod schema again for server-side validation
const formSchema = z.object({
    vehicle: z.string().min(1, "Vehicle is required"),
    vehicle_number: z.string().min(1, "Vehicle number is required"),
    vehicle_color: z.string().min(1, "Vehicle color is required"),
    id_number: z.string().min(1, "ID number is required"),
    drivers_license_number: z.string().min(1, "Driver's license number is required"),
    insurance_type: z.string().min(1, "Insurance type is required"),
    insurance_number: z.string().min(1, "Insurance number is required"),
    insurance_expiration: z.coerce.date({
        required_error: "Insurance expiration date is required.",
        invalid_type_error: "Invalid date format for insurance expiration.",
    }).min(new Date(), "Expiration date must be in the future."),
    witness_name: z.string().min(1, "Witness name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    witness_contact_number: z.string().min(1, "Witness contact number is required"),
});

export async function createRiderSecurityInformation(formData: z.infer<typeof formSchema>) {
    console.log("Server action: createRiderSecurityInformation started.");
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
        console.log("Server action: Supabase client created.");

        // Server-side validation
        const validatedData = formSchema.parse(formData);
        console.log("Server action: Form data validated.", validatedData);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("Server action: Auth error:", userError);
            return { error: "Authentication required" };
        }
        console.log("Server action: User found:", user.id);

        const { error } = await supabase
            .from('riders_security_information')
            .insert([
                {
                    rider_id: user.id,
                    vehicle: validatedData.vehicle,
                    vehicle_number: validatedData.vehicle_number,
                    vehicle_color: validatedData.vehicle_color,
                    id_number: validatedData.id_number,
                    drivers_license_number: validatedData.drivers_license_number,
                    insurance_type: validatedData.insurance_type,
                    insurance_number: validatedData.insurance_number,
                    insurance_expiration_date: validatedData.insurance_expiration.toISOString().split('T')[0],
                    witness_name: validatedData.witness_name,
                    witness_relationship: validatedData.relationship,
                    witness_phone_number: validatedData.witness_contact_number,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error("Server action: Supabase insert error:", error);
            return { error: error.message };
        }
        console.log("Server action: Data inserted successfully.");

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Server action: Zod validation error:", error.errors);
            return { error: "Validation failed: " + error.errors.map(e => e.message).join(', ') };
        }
        console.error("Server action: Unexpected error in createRiderSecurityInformation:", error);
        return { error: "Failed to save security information." };
    }
}
