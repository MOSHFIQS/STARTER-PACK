import { AuditAction } from '@prisma/client';

export interface AuditLogInput {
     userId?: string;
     role?: string;
     action: AuditAction;
     entity?: string;
     entityId?: string;
     ipAddress?: string;
     device?: string;
     userAgent?: string;
     beforeValue?: any;
     afterValue?: any;
     description?: string;
}
