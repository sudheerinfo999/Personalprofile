import * as XLSX from "xlsx";

import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RowResult = {
  row: number;
  email?: string;
  status: "created" | "updated" | "skipped" | "error";
  message?: string;
};

function normalizeEmail(v: unknown) {
  return typeof v === "string" ? v.trim().toLowerCase() : "";
}

function normalizeString(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file field 'file' (xlsx)" },
        { status: 400 },
      );
    }

    const ab = await file.arrayBuffer();
    const wb = XLSX.read(ab, { type: "array" });
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    if (!sheet) {
      return NextResponse.json(
        { error: "No sheet found in file" },
        { status: 400 },
      );
    }

    // Expect header row: email, password, name
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
    });

    if (!rawRows.length) {
      return NextResponse.json(
        { error: "Excel file has no rows" },
        { status: 400 },
      );
    }

    const supabaseAdmin = createSupabaseAdminClient();

  const results: RowResult[] = [];
  let created = 0;
  let updated = 0;
  let errors = 0;

  for (let i = 0; i < rawRows.length; i++) {
    const excelRowIndex = i + 2; // header is row 1
    const r = rawRows[i] ?? {};

    const email = normalizeEmail(r.email);
    const password = normalizeString(r.password);
    const name = normalizeString(r.name);

    if (!email && !password && !name) {
      results.push({ row: excelRowIndex, status: "skipped", message: "Empty row" });
      continue;
    }

    if (!email || !isValidEmail(email)) {
      errors++;
      results.push({
        row: excelRowIndex,
        email,
        status: "error",
        message: "Invalid email",
      });
      continue;
    }

    if (!password || password.length < 8) {
      errors++;
      results.push({
        row: excelRowIndex,
        email,
        status: "error",
        message: "Password must be at least 8 characters",
      });
      continue;
    }

    // If profile exists, we treat as update; else create.
    const { data: existingProfile, error: profileLookupError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (profileLookupError) {
      errors++;
      results.push({
        row: excelRowIndex,
        email,
        status: "error",
        message: profileLookupError.message,
      });
      continue;
    }

    if (existingProfile?.id) {
      const { data: updatedUser, error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(existingProfile.id, {
          password,
          user_metadata: name ? { name } : undefined,
        });

      if (updateError || !updatedUser.user) {
        errors++;
        results.push({
          row: excelRowIndex,
          email,
          status: "error",
          message: updateError?.message ?? "Failed to update user",
        });
        continue;
      }

      // Ensure employee role
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: updatedUser.user.id,
            email,
            name: name || null,
            role: "employee",
          },
          { onConflict: "id" },
        );

      updated++;
      results.push({
        row: excelRowIndex,
        email,
        status: "updated",
        message: "Updated existing user",
      });
      continue;
    }

    const { data: createdUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: name ? { name } : undefined,
      });

    if (createError || !createdUser.user) {
      errors++;
      results.push({
        row: excelRowIndex,
        email,
        status: "error",
        message: createError?.message ?? "Failed to create user",
      });
      continue;
    }

    // Ensure employee role (trigger may already create this; upsert is safe)
    await supabaseAdmin.from("profiles").upsert(
      {
        id: createdUser.user.id,
        email,
        name: name || null,
        role: "employee",
      },
      { onConflict: "id" },
    );

    created++;
    results.push({
      row: excelRowIndex,
      email,
      status: "created",
      message: "Created user",
    });
  }

    return NextResponse.json({
      summary: { created, updated, errors, totalRows: rawRows.length },
      results,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Upload failed",
      },
      { status: 500 },
    );
  }
}

