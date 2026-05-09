import { AlertCircle } from "lucide-react";

import { listPortfoliosForRole } from "@/lib/db/portfolios";
import { getCurrentProfile } from "@/lib/auth/profile";
import { PortfolioFilters } from "@/components/portfolios/portfolio-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const missingEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (missingEnv) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Supabase is not configured
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your <code>.env.local</code>,
          then restart the dev server.
        </CardContent>
      </Card>
    );
  }

  const profile = await getCurrentProfile();
  const role = profile?.role ?? "employee";
  const { portfolios, error } = await listPortfoliosForRole(role);

  if (error) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Couldn&apos;t load portfolios
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Portfolios</h1>
        <p className="text-sm text-muted-foreground">
          Browse and launch your available projects from one place.
        </p>
      </div>

      <PortfolioFilters portfolios={portfolios} />
    </div>
  );
}

