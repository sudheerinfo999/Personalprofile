import { PortfolioGridSkeleton } from "@/components/portfolios/portfolio-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="mt-2 h-4 w-72 rounded bg-muted" />
      </div>
      <PortfolioGridSkeleton />
    </div>
  );
}

