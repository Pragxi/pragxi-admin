"use server";

import {createClient} from "@/utils/supabase/server";

export const logoutAction = async () => {
    const supabase = await createClient();

    const {error} = await supabase.auth.signOut();

    if (error) {
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
};