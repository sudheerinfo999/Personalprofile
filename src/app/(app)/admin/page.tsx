import { requireRole } from "@/lib/auth/guards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  await requireRole("admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Manage portfolios and access configuration.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolios</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Create, edit, and activate/deactivate portfolio entries.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Logs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Future-ready area for usage analytics and audit trails.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

