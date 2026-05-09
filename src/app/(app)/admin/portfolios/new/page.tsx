import { requireRole } from "@/lib/auth/guards";
import { PortfolioForm } from "@/components/portfolios/portfolio-form";

export default async function NewPortfolioPage() {
  await requireRole("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">New portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Add a portfolio entry and configure its URL.
        </p>
      </div>
      <PortfolioForm mode="create" />
    </div>
  );
}

