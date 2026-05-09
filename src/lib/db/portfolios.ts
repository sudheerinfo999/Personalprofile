import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Portfolio = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnail_path: string | null;
  category: string | null;
  tags: string[];
  is_active: boolean;
  created_at: string;
};

export async function listPortfoliosForRole(role: "admin" | "employee") {
  const supabase = await createSupabaseServerClient();

  const query = supabase
    .from("portfolios")
    .select(
      "id,title,description,url,thumbnail_path,category,tags,is_active,created_at",
    )
    .order("created_at", { ascending: false });

  const { data, error } =
    role === "admin" ? await query : await query.eq("is_active", true);

  if (error) {
    return { portfolios: [] as Portfolio[], error: error.message };
  }

  return {
    portfolios: (data ?? []) as Portfolio[],
    error: null as string | null,
  };
}

export async function getPortfolioById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolios")
    .select(
      "id,title,description,url,thumbnail_path,category,tags,is_active,created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) return { portfolio: null as Portfolio | null, error: error.message };
  return { portfolio: (data as Portfolio | null) ?? null, error: null as string | null };
}

