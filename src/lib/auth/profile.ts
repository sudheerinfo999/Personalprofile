import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isUserRole, type UserRole } from "@/lib/auth/roles";

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
};

export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,name,email,role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile) return null;
  if (!isUserRole(profile.role)) return null;

  return profile as Profile;
}

