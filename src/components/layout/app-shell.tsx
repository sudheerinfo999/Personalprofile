"use client";

import * as React from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export type AppShellUser = {
  name: string | null;
  email: string | null;
  role: "admin" | "employee";
};

export function AppShell({
  user,
  children,
}: {
  user: AppShellUser;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-background">
      <Sidebar role={user.role} />
      <div className="min-w-0 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

