import * as XLSX from "xlsx";

import { NextResponse } from "next/server";

import { getCurrentProfile } from "@/lib/auth/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = [
    { email: "employee1@company.com", password: "ChangeMe123!", name: "Employee 1" },
    { email: "employee2@company.com", password: "ChangeMe123!", name: "Employee 2" },
  ];

  const ws = XLSX.utils.json_to_sheet(rows, { header: ["email", "password", "name"] });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "employees");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  const body = new Uint8Array(buf);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="employee_import_template.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}

