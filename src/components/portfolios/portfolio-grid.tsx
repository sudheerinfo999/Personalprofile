import type { Portfolio } from "@/lib/db/portfolios";
import { PortfolioCard } from "@/components/portfolios/portfolio-card";

export function PortfolioGrid({ portfolios }: { portfolios: Portfolio[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {portfolios.map((p) => (
        <PortfolioCard key={p.id} portfolio={p} />
      ))}
    </div>
  );
}

