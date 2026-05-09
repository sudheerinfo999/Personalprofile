"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseTags, portfolioInputSchema } from "@/lib/validators/portfolio";

export async function createPortfolioAction(input: unknown) {
  const profile = await requireRole("admin");
  const parsed = portfolioInputSchema.parse(input);

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      title: parsed.title,
      description: parsed.description || null,
      url: parsed.url,
      category: parsed.category || null,
      tags: parseTags(parsed.tagsText),
      is_active: parsed.is_active,
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/portfolios");
  revalidatePath("/");
  return { id: data.id as string };
}

export async function updatePortfolioAction(id: string, input: unknown) {
  await requireRole("admin");
  const parsed = portfolioInputSchema.parse(input);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("portfolios")
    .update({
      title: parsed.title,
      description: parsed.description || null,
      url: parsed.url,
      category: parsed.category || null,
      tags: parseTags(parsed.tagsText),
      is_active: parsed.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/portfolios");
  revalidatePath(`/admin/portfolios/${id}/edit`);
  revalidatePath("/");
}

export async function deletePortfolioAction(id: string) {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("portfolios").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/portfolios");
  revalidatePath("/");
}

export async function setPortfolioThumbnailPathAction(
  id: string,
  thumbnail_path: string | null,
) {
  await requireRole("admin");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("portfolios")
    .update({ thumbnail_path, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/portfolios");
  revalidatePath(`/admin/portfolios/${id}/edit`);
  revalidatePath("/");
}

