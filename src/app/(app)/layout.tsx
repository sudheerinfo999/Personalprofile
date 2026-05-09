import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/auth/profile";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const missingEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (missingEnv) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle>Supabase is not configured</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Create <code>.env.local</code> from <code>.env.example</code> and
              set:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <code>NEXT_PUBLIC_SUPABASE_URL</code>
              </li>
              <li>
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              </li>
            </ul>
            <p>Then restart the dev server.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <AppShell
      user={{
        name: profile.name,
        email: profile.email,
        role: profile.role,
      }}
    >
      {children}
    </AppShell>
  );
}

