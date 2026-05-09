"use client";

import * as React from "react";

import type { Portfolio } from "@/lib/db/portfolios";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PortfolioGrid } from "@/components/portfolios/portfolio-grid";

function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function PortfolioFilters({ portfolios }: { portfolios: Portfolio[] }) {
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    portfolios.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [portfolios]);

  const filtered = React.useMemo(() => {
    const nq = normalize(q);
    return portfolios.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!nq) return true;
      const hay = normalize(
        [p.title, p.description ?? "", p.category ?? "", ...(p.tags ?? [])].join(
          " ",
        ),
      );
      return hay.includes(nq);
    });
  }, [q, category, portfolios]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search portfolios…"
          className="sm:max-w-sm"
        />
        <div className="sm:ml-auto sm:w-[220px]">
          <Select
            value={category}
            onValueChange={(value) => setCategory(value ?? "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <PortfolioGrid portfolios={filtered} />
    </div>
  );
}

