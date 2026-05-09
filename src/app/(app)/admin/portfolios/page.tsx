import Link from "next/link";

import { requireRole } from "@/lib/auth/guards";
import { listPortfoliosForRole } from "@/lib/db/portfolios";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function AdminPortfoliosPage() {
  await requireRole("admin");

  const { portfolios, error } = await listPortfoliosForRole("admin");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Portfolios</h1>
          <p className="text-sm text-muted-foreground">
            Manage portfolio entries and visibility.
          </p>
        </div>
        <Link href="/admin/portfolios/new" className={buttonVariants()}>
          New portfolio
        </Link>
      </div>

      {error ? (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Couldn&apos;t load portfolios</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      ) : portfolios.length === 0 ? (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>No portfolios yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Create your first portfolio to make it available on the dashboard.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {portfolios.map((p) => (
            <Card key={p.id}>
              <CardContent className="py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{p.title}</div>
                    {p.is_active ? (
                      <Badge variant="secondary">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                    {p.category ? (
                      <Badge variant="outline">{p.category}</Badge>
                    ) : null}
                  </div>
                  {p.description ? (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {p.description}
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Open
                  </Link>
                  <Link
                    href={`/admin/portfolios/${p.id}/edit`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    Edit
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

