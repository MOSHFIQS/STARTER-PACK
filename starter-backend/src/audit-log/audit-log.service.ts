import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { buildPaginationMeta } from '../common/interfaces/response.interface';
import { PrismaService } from '../common/prisma/prisma.service';
import {
     buildOrderBy,
     buildPagination,
     buildSearchFilter,
     mergeWhere,
} from '../common/utils/pagination.util';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
import { AuditLogInput } from './interfaces/audit-log.interface';

@Injectable()
export class AuditLogService {
     private readonly logger = new Logger(AuditLogService.name);

     constructor(private readonly prisma: PrismaService) { }

     /**
      * Create an audit log entry. Fire-and-forget (never blocks the main flow).
      */
     async log(input: AuditLogInput): Promise<void> {
          try {
               await this.prisma.auditLog.create({
                    data: {
                         userId: input.userId || null,
                         role: input.role || null,
                         action: input.action,
                         entity: input.entity || null,
                         entityId: input.entityId || null,
                         ipAddress: input.ipAddress || null,
                         device: input.device || null,
                         userAgent: input.userAgent || null,
                         beforeValue: input.beforeValue
                              ? (input.beforeValue as Prisma.InputJsonValue)
                              : Prisma.JsonNull,
                         afterValue: input.afterValue
                              ? (input.afterValue as Prisma.InputJsonValue)
                              : Prisma.JsonNull,
                         description: input.description || null,
                    },
               });
          } catch (error) {
               this.logger.error(
                    `Failed to create audit log: ${(error as Error).message}`,
               );
          }
     }

     /**
      * List audit logs with filtering and pagination (Admin only).
      */
     async findAll(dto: FilterAuditLogDto) {
          const where = mergeWhere(
               buildSearchFilter(dto.search, ['description', 'entity', 'role']),
               dto.action ? { action: dto.action } : undefined,
               dto.userId ? { userId: dto.userId } : undefined,
               dto.entity ? { entity: dto.entity } : undefined,
               dto.entityId ? { entityId: dto.entityId } : undefined,
          );

          const [items, total] = await Promise.all([
               this.prisma.auditLog.findMany({
                    where,
                    ...buildPagination(dto.page, dto.limit),
                    orderBy: buildOrderBy(dto.sortBy, dto.sortOrder),
                    include: {
                         user: {
                              select: {
                                   id: true,
                                   email: true,
                                   fullName: true,
                                   role: true,
                              },
                         },
                    },
               }),
               this.prisma.auditLog.count({ where }),
          ]);

          return {
               data: items,
               meta: buildPaginationMeta(total, dto.page || 1, dto.limit || 10),
          };
     }

     /**
      * Get a single audit log by ID.
      */
     async findOne(id: string) {
          return this.prisma.auditLog.findUnique({
               where: { id },
               include: {
                    user: {
                         select: {
                              id: true,
                              email: true,
                              fullName: true,
                              role: true,
                         },
                    },
               },
          });
     }
}
