"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  portfolioInputSchema,
  type PortfolioInput,
} from "@/lib/validators/portfolio";
import {
  createPortfolioAction,
  deletePortfolioAction,
  setPortfolioThumbnailPathAction,
  updatePortfolioAction,
} from "@/app/(app)/admin/portfolios/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const BUCKET = "portfolio-thumbnails";

export function PortfolioForm({
  mode,
  portfolioId,
  defaultValues,
}: {
  mode: "create" | "edit";
  portfolioId?: string;
  defaultValues?: Partial<PortfolioInput>;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const form = useForm<PortfolioInput>({
    resolver: zodResolver(portfolioInputSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      category: "",
      tagsText: "",
      is_active: true,
      ...defaultValues,
    },
  });

  async function uploadThumbnail(id: string) {
    if (!file) return null;
    const supabase = createSupabaseBrowserClient();
    const ext = file.name.split(".").pop() || "png";
    const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${id}/thumbnail.${safeExt}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) throw new Error(error.message);
    return path;
  }

  async function onSubmit(values: PortfolioInput) {
    setIsSaving(true);
    try {
      const parsed = portfolioInputSchema.parse(values);
      const id =
        mode === "create"
          ? (await createPortfolioAction(parsed)).id
          : (portfolioId as string);

      if (mode === "edit") {
        await updatePortfolioAction(id, parsed);
      }

      if (file) {
        const path = await uploadThumbnail(id);
        await setPortfolioThumbnailPathAction(id, path);
      }

      toast.success(mode === "create" ? "Portfolio created" : "Portfolio updated");
      router.replace("/admin/portfolios");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDelete() {
    if (mode !== "edit" || !portfolioId) return;
    const ok = window.confirm(
      "Delete this portfolio? This action cannot be undone.",
    );
    if (!ok) return;

    setIsDeleting(true);
    try {
      await deletePortfolioAction(portfolioId);
      toast.success("Portfolio deleted");
      router.replace("/admin/portfolios");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create portfolio" : "Edit portfolio"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Portfolio name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description"
                      className="min-h-[96px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Internal Tools" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tagsText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="comma,separated,tags" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <FormLabel>Thumbnail</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground">
                  Uploads to Supabase Storage bucket: <code>{BUCKET}</code>
                </p>
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-border/60 p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Only active portfolios show up for employees.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {mode === "edit" ? (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onDelete}
                    disabled={isSaving || isDeleting}
                  >
                    {isDeleting ? "Deleting…" : "Delete"}
                  </Button>
                ) : null}
              </div>
              <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : "Save"}
              </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

