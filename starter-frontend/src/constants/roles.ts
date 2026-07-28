export const ROLES = {
     SUPER_ADMIN: "SUPER_ADMIN",
     ADMIN: "ADMIN",
     CUSTOMER: "CUSTOMER",
} as const;

export const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN] as const;

export const ROLE_LABELS: Record<string, string> = {
     SUPER_ADMIN: "Super Admin",
     ADMIN: "Admin",
     CUSTOMER: "Customer",
};

export const ROLE_BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
     SUPER_ADMIN: "default",
     ADMIN: "secondary",
     CUSTOMER: "outline",
};
