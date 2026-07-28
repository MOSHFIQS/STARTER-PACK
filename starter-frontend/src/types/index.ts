// ==================== ENUM TYPES ====================

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "SYSTEM";

export type AuditAction =
     | "LOGIN"
     | "LOGOUT"
     | "CREATE"
     | "UPDATE"
     | "DELETE"
     | "SOFT_DELETE"
     | "RESTORE"
     | "ADMIN_ACTION"
     | "PROFILE_CHANGE"
     | "ROLE_CHANGE"
     | "STATUS_CHANGE";

// ==================== NOTIFICATION ====================

export interface AppNotification {
     id: string;
     userId: string;
     type: NotificationType;
     title: string;
     message: string;
     data?: Record<string, unknown> | null;
     isRead: boolean;
     readAt?: string | null;
     createdAt: string;
     updatedAt: string;
}

// ==================== AUDIT LOG ====================

export interface AuditLog {
     id: string;
     userId?: string | null;
     user?: import("./user.types").User | null;
     role?: string | null;
     action: AuditAction;
     entity?: string | null;
     entityId?: string | null;
     ipAddress?: string | null;
     device?: string | null;
     userAgent?: string | null;
     beforeValue?: Record<string, unknown> | null;
     afterValue?: Record<string, unknown> | null;
     description?: string | null;
     createdAt: string;
}

// ==================== DASHBOARD ====================

export interface AdminOverview {
     counts: {
          users: number;
          customers: number;
          admins: number;
          superAdmins: number;
     };
     pending: {
          notifications: number;
     };
}

export interface UserStats {
     total: number;
     active: number;
     inactive: number;
     customers: number;
     admins: number;
     superAdmins: number;
}

// ==================== UPLOAD ====================

export interface UploadResult {
     url: string;
     publicId: string;
     resourceType: string;
     format?: string;
     width?: number;
     height?: number;
     bytes?: number;
}

export interface MultiUploadResult {
     urls: string[];
     results: UploadResult[];
}

// ==================== SITE SETTINGS ====================

export interface SiteSetting {
     id: string;
     siteName: string;
     tagline: string | null;
     logoUrl: string | null;
     phone: string | null;
     email: string | null;
     address: string | null;
     facebookUrl: string | null;
     twitterUrl: string | null;
     instagramUrl: string | null;
     linkedinUrl: string | null;
     createdAt: string;
     updatedAt: string;
}

export interface SiteSettingInput {
     siteName?: string;
     tagline?: string;
     logoUrl?: string;
     phone?: string;
     email?: string;
     address?: string;
     facebookUrl?: string;
     twitterUrl?: string;
     instagramUrl?: string;
     linkedinUrl?: string;
}
