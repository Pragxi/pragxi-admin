"use server";
import { createClient } from "@/utils/supabase/server";

export async function getRiderById(rider_id: string) {
  const supabase = await createClient();

  // Fetch personal info
  const { data: personal } = await supabase
    .from("riders_personal_information")
    .select("*")
    .eq("rider_id", rider_id)
    .maybeSingle();

  // Fetch security info
  const { data: security } = await supabase
    .from("riders_security_information")
    .select("*")
    .eq("rider_id", rider_id)
    .maybeSingle();

  return { 
    rider_id,
    personal, 
    security 
  };
}