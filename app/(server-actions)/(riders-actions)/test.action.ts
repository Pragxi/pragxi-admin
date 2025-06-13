"use server";

import {createServiceRoleClient} from "@/utils/supabase/service-role";

export const trial = async () => {
    const supabase = await createServiceRoleClient();

    const users = await supabase.auth.admin.getUserById("5dfef1b3-d5fa-453c-8b7f-eed9a86dd5fc");

    console.log({users});

    return {
        success: true
    };
}