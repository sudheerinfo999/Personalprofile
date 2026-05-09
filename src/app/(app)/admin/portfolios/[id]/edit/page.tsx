import { notFound } from "next/navigation";

import { requireRole } from "@/lib/auth/guards";
import { getPortfolioById } from "@/lib/db/portfolios";
import { PortfolioForm } from "@/components/portfolios/portfolio-form";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("admin");
  const { id } = await params;

  const { portfolio } = await getPortfolioById(id);
  if (!portfolio) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Edit portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Update metadata, URL, and visibility.
        </p>
      </div>
      <PortfolioForm
        mode="edit"
        portfolioId={portfolio.id}
        defaultValues={{
          title: portfolio.title,
          description: portfolio.description ?? "",
          url: portfolio.url,
          category: portfolio.category ?? "",
          tagsText: (portfolio.tags ?? []).join(", "),
          is_active: portfolio.is_active,
        }}
      />
    </div>
  );
}

