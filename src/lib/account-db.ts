import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  display_name: string;
  email: string;
  points: number;
  created_at: string;
};

export type Plan = {
  id: string;
  user_id: string;
  drink_name: string;
  frequency: string;
  next_date: string | null;
  active: boolean;
  note: string;
  created_at: string;
};

export type PlanInput = {
  drink_name: string;
  frequency: string;
  next_date?: string | null;
  note?: string;
};

export async function fetchMyProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, email, points, created_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile | null) ?? null;
}

export async function fetchPlans(userId?: string): Promise<Plan[]> {
  let q = supabase.from("plans").select("*").order("created_at", { ascending: false });
  if (userId) q = q.eq("user_id", userId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Plan[];
}

export async function createPlan(userId: string, input: PlanInput): Promise<Plan> {
  const { data, error } = await supabase
    .from("plans")
    .insert({
      user_id: userId,
      drink_name: input.drink_name,
      frequency: input.frequency,
      next_date: input.next_date ?? null,
      note: input.note ?? "",
    })
    .select()
    .single();
  if (error) throw error;
  return data as Plan;
}

export async function updatePlan(id: string, patch: Partial<Plan>): Promise<void> {
  const { error } = await supabase.from("plans").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deletePlan(id: string): Promise<void> {
  const { error } = await supabase.from("plans").delete().eq("id", id);
  if (error) throw error;
}

/* ---------- Admin ---------- */

export async function adminFetchProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, email, points, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function adminUpdateProfile(
  id: string,
  patch: { display_name?: string; points?: number },
): Promise<void> {
  const { error } = await supabase.from("profiles").update(patch).eq("id", id);
  if (error) throw error;
}

export type RoleRow = { user_id: string; role: "admin" | "barista" | "customer" };

export async function adminFetchRoles(): Promise<RoleRow[]> {
  const { data, error } = await supabase.from("user_roles").select("user_id, role");
  if (error) throw error;
  return (data ?? []) as RoleRow[];
}

export async function adminSetRole(userId: string, role: RoleRow["role"]): Promise<void> {
  const del = await supabase.from("user_roles").delete().eq("user_id", userId);
  if (del.error) throw del.error;
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
  if (error) throw error;
}
