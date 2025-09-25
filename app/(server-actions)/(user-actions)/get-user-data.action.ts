'use server';

import {createClient} from "@/utils/supabase/server";

type UserDataResponse = 
  | { user: any; success: true } 
  | { success: false; error: string };

export const getUserDataAction = async (): Promise<UserDataResponse> => {
    const supabase = await createClient();
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
        return {
            success: false,
            error: error.message
        };
    }

    return { user, success: true };
};