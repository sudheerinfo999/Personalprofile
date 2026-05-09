"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, LayoutGrid, Shield, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const baseItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
] as const;

const adminItems = [
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/admin/portfolios", label: "Portfolios", icon: Briefcase },
  { href: "/admin/users", label: "Bulk Users", icon: Upload },
] as const;

export function Sidebar({ role }: { role: "admin" | "employee" }) {
  const pathname = usePathname();
  const items = role === "admin" ? [...baseItems, ...adminItems] : baseItems;

  return (
    <aside className="hidden md:flex md:flex-col border-r border-border/60 bg-muted/10">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 ring-1 ring-border/60" />
          <div className="min-w-0">
            <div className="font-semibold tracking-tight truncate">
              Portfolio Hub
            </div>
            <div className="text-xs text-muted-foreground truncate">
              Centralized access
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-muted/60",
                active && "bg-muted text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Role:</span> {role}
      </div>
    </aside>
  );
}

