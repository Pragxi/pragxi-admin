"use server";

import {createClient} from "@/utils/supabase/server";
import {RiderInfoSchema} from "@/types/rider";
import * as z from "zod";
import {createServiceRoleClient} from "@/utils/supabase/service-role";

export const addRiderPersonalAction = async (formData: z.infer<typeof RiderInfoSchema>) => {
    const rawFormData = formData;

    const parsedData = RiderInfoSchema.safeParse({
        ...rawFormData,
        date_of_birth: rawFormData.dob ? new Date(rawFormData.dob as unknown as string) : null,
    });

    if (!parsedData.success) {
        return {
            success: false,
            error: "Invalid form data",
            issues: parsedData.error.issues,
        };
    }

    const supabase = await createClient();

    try {
        // First, check if email already exists in riders_personal_information and users tables
        const {data: existingUser, error: userLookupError} = await supabase
            .from('users')
            .select('email')
            .eq('email', parsedData.data.email)
            .maybeSingle();

        const {data: existingRiderPersonalInformation, error: riderInfoLookupError} = await supabase
            .from('riders_personal_information')
            .select('email')
            .eq('email', parsedData.data.email)
            .maybeSingle();
        // ===================================================================

        // handle lookup errors
        if (userLookupError) {
            console.log("User lookup error: ", userLookupError.message)

            return {
                success: false,
                error: "Failed to check if email already exists",
            };
        }

        if (riderInfoLookupError) {
            console.log("Rider Info lookup error: ", riderInfoLookupError.message)

            return {
                success: false,
                error: "Failed to check if email already exists",
            };
        }
        // ===================================================================

        // If email already exists, return an error
        if (existingUser || existingRiderPersonalInformation) {
            return {
                success: false,
                error: "Email already exists in our system",
            };
        }


        // Generate password
        const password = generateRandomPassword();

        // Log generated credentials
        console.log('Generated credentials:', {email: parsedData.data.email, password});

        console.log('Parsed data:', parsedData.data);

        // Sign up the user
        const {data: authData, error: authError} = await supabase.auth.signUp({
            email: parsedData.data.email,
            password: password,
            options: {
                data: {
                    first_name: parsedData.data.first_name,
                    last_name: parsedData.data.last_name,
                    user_role: 'rider',
                    phone_number: parsedData.data.phone_number,
                }
            }
        });

        // Log auth data
        console.log(`Auth Data:`, authData, `Error: ${authError}`);

        // Handle auth errors
        if (authError) {
            return {
                success: false,
                error: authError.message,
            };
        }

        if (!authData.user) {
            return {
                success: false,
                error: "User creation failed - no user returned",
            };
        }
        // ===================================================================

        // Insert rider personal information
        const {error: riderError} = await supabase
            .from('riders_personal_information')
            .insert({
                first_name: parsedData.data.first_name,
                last_name: parsedData.data.last_name,
                rider_id: authData.user.id,
                phone_number: parsedData.data.phone_number,
                email: parsedData.data.email,
                dob: parsedData.data.dob.toISOString(),
                marital_status: parsedData.data.marital_status,
                gender: parsedData.data.gender,
                city: parsedData.data.city,
                nationality: parsedData.data.nationality,
                gps_address: parsedData.data.gps_address,
            });

        if (riderError) {
            // Create a new Supabase client for the service role (More like Super Admin in Supabase)
            const serviceRoleClient = await createServiceRoleClient();

            // Attempt to delete the user if personal info insertion fails
            await serviceRoleClient.auth.admin.deleteUser(authData.user.id);

            // Attempt to delete the user if personal info insertion fails
            await supabase.from('users').delete().eq('id', authData.user.id);

            console.log("Failed to add rider:", riderError.message);
            return {
                success: false,
                error: "Failed to add rider - please try again later",
            };
        }

        return {
            success: true,
            data: {
                user_id: authData.user.id,
                email: parsedData.data.email,
            },
        };

    } catch (error: unknown) {
        // Log the error
        console.error("Error adding rider:", error);

        // Return an error message
        const errorMessage = error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";

        console.log("An unexpected error occurred: ", errorMessage);
        return {
            success: false,
            error: "An unexpected error occurred. Please try again.",
        };
    }
};

function generateRandomPassword(length = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}