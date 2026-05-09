export type UserRole = "admin" | "employee";

export function isUserRole(value: unknown): value is UserRole {
  return value === "admin" || value === "employee";
}

