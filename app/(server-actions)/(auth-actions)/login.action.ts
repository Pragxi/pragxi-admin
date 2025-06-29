"use server";

import {createClient} from "@/utils/supabase/server";

export const loginAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const {error, data} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return {
            success: false,
            error: error.message
        };
    }

    console.log({data});

    return {
        success: true,
        user: data.user
    };
};