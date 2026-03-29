import { createClient } from "@/lib/supabase/server";
import type { MoneyCheck } from "@/lib/types";

export async function getRecentMoneyChecks(userId: string, limit = 5): Promise<MoneyCheck[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("money_checks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  if (!data) return [];
  return data as MoneyCheck[];
}

export async function getAllMoneyChecks(userId: string): Promise<MoneyCheck[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("money_checks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];
  return data as MoneyCheck[];
}

export async function getMoneyCheckById(userId: string, checkId: string): Promise<MoneyCheck | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("money_checks")
    .select("*")
    .eq("user_id", userId)
    .eq("id", checkId)
    .maybeSingle();

  if (error || !data) return null;
  return data as MoneyCheck;
}
