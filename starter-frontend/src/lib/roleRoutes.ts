import type { UserRole } from "@/types/user.types";

const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
     SUPER_ADMIN: "/dashboard",
     ADMIN: "/dashboard",
     CUSTOMER: "/dashboard",
};

export function getDashboardRoute(role?: UserRole | null): string {
     if (!role) return "/dashboard";
     return ROLE_DASHBOARD_ROUTES[role] || "/dashboard";
}

export function isAdminRole(role?: UserRole | null): boolean {
     return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function isSuperAdmin(role?: UserRole | null): boolean {
     return role === "SUPER_ADMIN";
}
