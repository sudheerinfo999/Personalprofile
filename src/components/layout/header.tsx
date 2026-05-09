"use client";

import { LogOut, User } from "lucide-react";

import { useSignOut } from "@/hooks/use-sign-out";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppShellUser } from "@/components/layout/app-shell";
import { cn } from "@/lib/utils";

function initials(name: string | null, email: string | null) {
  const base = (name || email || "U").trim();
  const parts = base.split(/\s+/).slice(0, 2);
  return parts
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .join("");
}

export function Header({ user }: { user: AppShellUser }) {
  const { signOut, isSigningOut } = useSignOut();

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-14 px-4 md:px-8 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">Dashboard</div>
          <div className="text-xs text-muted-foreground truncate">
            Welcome back{user.name ? `, ${user.name}` : ""}.
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "gap-2 pl-2 pr-3",
              )}
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback>
                  {initials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm truncate max-w-[180px]">
                {user.email ?? "User"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="space-y-0.5">
                <div className="text-sm font-medium truncate">
                  {user.name ?? "Account"}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.role}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="gap-2">
                <User className="h-4 w-4" />
                Profile (coming soon)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2"
                onClick={() => void signOut()}
                disabled={isSigningOut}
              >
                <LogOut className="h-4 w-4" />
                {isSigningOut ? "Signing out…" : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

