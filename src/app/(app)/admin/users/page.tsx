import { requireRole } from "@/lib/auth/guards";
import UsersBulkUploadClient from "./users-bulk-upload-client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireRole("admin");

  return <UsersBulkUploadClient />;
}

