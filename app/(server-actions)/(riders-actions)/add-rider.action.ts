"use server";

import {createClient} from "@/utils/supabase/server";
import {riderPersonalInformationSchema} from "@/types/rider";

export const addRiderAction = async (formData: FormData) => {
    const rawFormData = Object.fromEntries(formData.entries());

    const parsedData = riderPersonalInformationSchema.safeParse({
        ...rawFormData,
        date_of_birth: rawFormData.date_of_birth ? new Date(rawFormData.date_of_birth as string) : null,
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
        // First, check if email already exists in riders_personal_information
        const { data: existingRider, error: lookupError } = await supabase
            .from('riders_personal_information')
            .select('email')
            .eq('email', parsedData.data.email)
            .maybeSingle();

        if (lookupError) {
            return {
                success: false,
                error: lookupError.message,
            };
        }

        if (existingRider) {
            return {
                success: false,
                error: "Email already exists in our system",
            };
        }

        // Generate username and password
        const username = `${parsedData.data.first_name.toLowerCase()}.${parsedData.data.last_name.toLowerCase()}`;
        const password = generateRandomPassword();

        console.log('Generated credentials:', {username, password});

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

        console.log({authData, authError});

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

        // Insert rider personal information
        const {error: riderError} = await supabase
            .from('riders_personal_information')
            .insert({
                rider_id: authData.user.id,
                phone_number: parsedData.data.phone_number,
                email: parsedData.data.email,
                dob: parsedData.data.date_of_birth.toISOString(),
                marital_status: parsedData.data.marital_status,
                gender: parsedData.data.gender,
                city: parsedData.data.city,
                gps_address: parsedData.data.gps_address,
            });

        if (riderError) {
            // Attempt to delete the user if personal info insertion fails
            await supabase.auth.admin.deleteUser(authData.user.id);
            return {
                success: false,
                error: riderError.message,
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
        console.error("Error adding rider:", error);
        const errorMessage = error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";
        return {
            success: false,
            error: errorMessage,
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