import { UserRole } from '@prisma/client';

export const ROLES = {
     SUPER_ADMIN: 'SUPER_ADMIN',
     ADMIN: 'ADMIN',
     CUSTOMER: 'CUSTOMER',
} as const;

export const ROLE_VALUES = Object.values(ROLES);

export const PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

export const AUDIT_ACTIONS = {
     LOGIN: 'LOGIN',
     LOGOUT: 'LOGOUT',
     CREATE: 'CREATE',
     UPDATE: 'UPDATE',
     DELETE: 'DELETE',
     SOFT_DELETE: 'SOFT_DELETE',
     RESTORE: 'RESTORE',
} as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const CLOUDINARY_FOLDERS = {
     PROJECTS: 'projects',
     PROPERTIES: 'properties',
     RENTALS: 'rentals',
     ROOMS: 'rooms',
     PLOTS: 'plots',
     BLOGS: 'blogs',
     PROFILES: 'profiles',
     DOCUMENTS: 'documents',
     VIDEOS: 'videos',
     BANNERS: 'banners',
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

/**
 * Role hierarchy for hierarchical RBAC.
 * Higher-level roles automatically inherit the permissions of lower-level roles.
 *   SUPER_ADMIN (3) > ADMIN (2) > CUSTOMER (1)
 *
 * When a route is decorated with @Roles(UserRole.ADMIN), a SUPER_ADMIN (level 3)
 * is also granted access because their level is >= the required role's level.
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
     SUPER_ADMIN: 3,
     ADMIN: 2,
     CUSTOMER: 1,
};

/**
 * Returns true if the user's role satisfies the required role based on the
 * hierarchical RBAC model. A user is granted access when their role level is
 * greater than or equal to the level of any of the required roles.
 */
export function hasRoleAccess(userRole: UserRole, requiredRoles: UserRole[]): boolean {
     const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
     return requiredRoles.some((required) => userLevel >= ROLE_HIERARCHY[required]);
}

/**
 * Returns true if the actor role is at least an admin (SUPER_ADMIN or ADMIN).
 */
export function isAdminRole(role: UserRole): boolean {
     return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
}

/**
 * Returns true if the actor role is a super admin.
 */
export function isSuperAdminRole(role: UserRole): boolean {
     return role === UserRole.SUPER_ADMIN;
}
