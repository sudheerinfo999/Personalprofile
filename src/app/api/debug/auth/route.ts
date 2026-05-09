import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  const profile = await getCurrentProfile();

  return NextResponse.json({
    authUser: data?.user
      ? { id: data.user.id, email: data.user.email }
      : null,
    authError: error?.message ?? null,
    profile,
  });
}

