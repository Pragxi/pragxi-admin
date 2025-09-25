'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const updateUserProfileAction = async (formData: FormData) => {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Authentication required." };
    }

    const displayName = formData.get('display_name') as string;
    const email = formData.get('email') as string;

    if (!displayName.trim()) {
        return { error: "Display name is required." };
    }

    if (!email.trim()) {
        return { error: "Email is required." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Please enter a valid email address." };
    }

    try {
        const { error: updateError } = await supabase.auth.updateUser({
            email: email,
            data: {
                display_name: displayName,
            }
        });

        if (updateError) {
            return { error: `Failed to update profile: ${updateError.message}` };
        }

        revalidatePath('/account', 'page');
        return { success: true };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return { error: "An unexpected error occurred while updating your profile." };
    }
};

export const updateUserPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: "Authentication required." };
    }

    const currentPassword = formData.get('current_password') as string;
    const newPassword = formData.get('new_password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (!currentPassword) {
        return { error: "Current password is required." };
    }

    if (!newPassword) {
        return { error: "New password is required." };
    }

    if (newPassword.length < 6) {
        return { error: "New password must be at least 6 characters long." };
    }

    if (newPassword !== confirmPassword) {
        return { error: "New password and confirmation do not match." };
    }

    try {
        // First verify the current password by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: currentPassword,
        });

        if (signInError) {
            return { error: "Current password is incorrect." };
        }

        // Update the password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) {
            return { error: `Failed to update password: ${updateError.message}` };
        }

        return { success: true };
    } catch (error) {
        console.error("Error updating user password:", error);
        return { error: "An unexpected error occurred while updating your password." };
    }
};
