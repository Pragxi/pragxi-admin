'use server';

import {createClient} from "@/utils/supabase/server";

export const getUserDataAction = async () => {
    const supabase = await createClient();
    const {data: user, error} = await supabase.auth.getUser();

    if (error) {
        return {
            success: false,
            error: error.message
        };
    }

    return user;
};