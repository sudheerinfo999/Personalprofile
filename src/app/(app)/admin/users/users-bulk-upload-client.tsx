"use client";

import * as React from "react";
import { toast } from "sonner";

import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type BulkResponse = {
  summary: { created: number; updated: number; errors: number; totalRows: number };
  results: {
    row: number;
    email?: string;
    status: "created" | "updated" | "skipped" | "error";
    message?: string;
  }[];
};

export default function UsersBulkUploadClient() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [result, setResult] = React.useState<BulkResponse | null>(null);

  async function onUpload() {
    if (!file) {
      toast.error("Choose an .xlsx file first");
      return;
    }

    setIsUploading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/admin/users/bulk", {
        method: "POST",
        body: fd,
      });

      const contentType = res.headers.get("content-type") || "";
      const bodyText = await res.text();
      const data =
        contentType.includes("application/json") && bodyText
          ? (JSON.parse(bodyText) as any)
          : null;
      if (!res.ok) {
        toast.error(
          data?.error ??
            (bodyText ? bodyText.slice(0, 300) : `Upload failed (${res.status})`),
        );
        return;
      }

      if (!data) {
        toast.error("Upload failed: server returned a non-JSON response");
        return;
      }

      setResult(data as BulkResponse);
      toast.success("Processed Excel file");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Bulk employee import</h1>
        <p className="text-sm text-muted-foreground">
          Upload an Excel file with <code>email</code>, <code>password</code>,{" "}
          <code>name</code>. Users will be created/updated as{" "}
          <span className="font-medium text-foreground">employee</span>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Download the template, fill it, then upload the same format.
          </div>
          <a
            className={cn(buttonVariants({ variant: "secondary" }))}
            href="/api/admin/users/template"
          >
            Download Excel template
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="excel">Excel file (.xlsx)</Label>
            <Input
              id="excel"
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <Button onClick={onUpload} disabled={isUploading || !file}>
            {isUploading ? "Uploading…" : "Upload & import"}
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <div>
                <span className="font-medium">Created:</span> {result.summary.created}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {result.summary.updated}
              </div>
              <div>
                <span className="font-medium">Errors:</span> {result.summary.errors}
              </div>
              <div>
                <span className="font-medium">Rows:</span> {result.summary.totalRows}
              </div>
            </div>

            <div className="overflow-auto rounded-md border border-border/60">
              <table className="w-full text-left">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-3 py-2 font-medium">Row</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {result.results.map((r) => (
                    <tr key={`${r.row}-${r.email ?? ""}`} className="border-t">
                      <td className="px-3 py-2">{r.row}</td>
                      <td className="px-3 py-2">{r.email ?? "-"}</td>
                      <td className="px-3 py-2">{r.status}</td>
                      <td className="px-3 py-2">{r.message ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

