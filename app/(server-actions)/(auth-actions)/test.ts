"use server";

// sample code to update the user metadata

import {createClient} from "@/utils/supabase/server";

export const updateMetaData = async () => {
    const supabase = await createClient();
    const response = await supabase.auth.updateUser({
        data: {
            user_role: "admin"
        }
    });

    console.log({response})
}