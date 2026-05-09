"use client";

import * as React from "react";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const signOut = React.useCallback(async () => {
    setIsSigningOut(true);
    try {
      const res = await fetch("/auth/sign-out", {
        method: "POST",
        credentials: "same-origin",
        redirect: "manual",
      });

      const loc = res.headers.get("Location");
      if (res.status >= 300 && res.status < 400 && loc) {
        window.location.replace(new URL(loc, window.location.origin).href);
        return;
      }

      if (res.ok) {
        window.location.replace("/login");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      window.location.replace("/login");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to sign out");
      try {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      } catch {
        /* ignore */
      }
      window.location.replace("/login");
    } finally {
      setIsSigningOut(false);
    }
  }, []);

  return { signOut, isSigningOut };
}
