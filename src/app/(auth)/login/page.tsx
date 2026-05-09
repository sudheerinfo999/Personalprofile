import { Suspense } from "react";
import LoginClient from "@/app/(auth)/login/login-client";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4" />
      }
    >
      <LoginClient />
    </Suspense>
  );
}

