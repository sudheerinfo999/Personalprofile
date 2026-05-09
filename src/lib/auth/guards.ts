import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/profile";
import type { UserRole } from "@/lib/auth/roles";

export async function requireRole(role: UserRole) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== role) redirect("/");
  return profile;
}

