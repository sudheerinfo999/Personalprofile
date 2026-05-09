import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Portfolio } from "@/lib/db/portfolios";

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="space-y-2">
        <div className="h-10 w-10 rounded-xl bg-primary/10 ring-1 ring-border/60" />
        <div className="space-y-1">
          <CardTitle className="text-base leading-6 line-clamp-1">
            {portfolio.title}
          </CardTitle>
          {portfolio.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {portfolio.description}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {portfolio.category ? (
            <Badge variant="secondary">{portfolio.category}</Badge>
          ) : null}
          {portfolio.tags?.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
          {!portfolio.is_active ? <Badge variant="destructive">Inactive</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter className="pt-0">
        <Link
          href={portfolio.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants(), "w-full justify-center")}
        >
          Open <ExternalLink className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}

