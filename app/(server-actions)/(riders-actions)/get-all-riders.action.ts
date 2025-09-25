"use server";
import { createClient } from "@/utils/supabase/server";

export async function getAllRiders() {
  const supabase = await createClient();

  // Fetch all personal info
  const { data: personal, error: personalError } = await supabase
    .from("riders_personal_information")
    .select("*");

  if (personalError) return { error: personalError.message };

  // Fetch all security info
  const { data: security } = await supabase
    .from("riders_security_information")
    .select("*");

  // Merge by rider_id
  const riders = personal.map((p) => ({
    ...p,
    security: security?.find((s) => s.rider_id === p.rider_id) || null,
  }));

  return { data: riders };
} 