import { z } from "zod";

export const portfolioInputSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().max(500).optional().or(z.literal("")),
  url: z.string().url("Enter a valid URL"),
  category: z.string().max(50).optional().or(z.literal("")),
  tagsText: z.string().max(200).optional().or(z.literal("")),
  is_active: z.boolean(),
});

export type PortfolioInput = z.infer<typeof portfolioInputSchema>;

export function parseTags(tagsText: string | undefined) {
  if (!tagsText) return [];
  return tagsText
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

