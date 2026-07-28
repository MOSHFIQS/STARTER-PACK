import {
     ForbiddenException,
     Injectable,
     Logger,
     NotFoundException
} from '@nestjs/common';
import { AuditAction, NotificationType, Prisma, UserRole } from '@prisma/client';
import { AuditLogService } from '../audit-log/audit-log.service';
import { isAdminRole } from '../common/constants';
import { buildPaginationMeta } from '../common/interfaces/response.interface';
import { PrismaService } from '../common/prisma/prisma.service';
import {
     buildOrderBy,
     buildPagination,
     buildSearchFilter,
     mergeWhere,
} from '../common/utils/pagination.util';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

export interface RequestMeta {
     ipAddress?: string;
     device?: string;
     userAgent?: string;
}

const NOTIFICATION_INCLUDE = {
     user: {
          select: {
               id: true,
               firstName: true,
               lastName: true,
               fullName: true,
          },
     },
} as const;

@Injectable()
export class NotificationsService {
     private readonly logger = new Logger(NotificationsService.name);

     constructor(
          private readonly prisma: PrismaService,
          private readonly auditLogService: AuditLogService,
     ) { }

     async findAll(dto: FilterNotificationDto, actor: { id: string; role: string }) {
          const where = mergeWhere(
               buildSearchFilter(dto.search, ['title', 'message']),
               dto.type ? { type: dto.type } : undefined,
               dto.isRead !== undefined ? { isRead: dto.isRead } : undefined,
          );

          // Customer data isolation: customers only see their own notifications
          if (!isAdminRole(actor.role as UserRole)) {
               where.userId = actor.id;
          } else if (dto.userId) {
               where.userId = dto.userId;
          }

          const [items, total] = await Promise.all([
               this.prisma.notification.findMany({
                    where,
                    ...buildPagination(dto.page, dto.limit),
                    orderBy: buildOrderBy(dto.sortBy, dto.sortOrder),
                    include: NOTIFICATION_INCLUDE,
               }),
               this.prisma.notification.count({ where }),
          ]);

          return {
               data: items,
               meta: buildPaginationMeta(total, dto.page || 1, dto.limit || 10),
          };
     }

     async findOne(id: string, actor: { id: string; role: string }) {
          const notification = await this.prisma.notification.findUnique({
               where: { id },
               include: NOTIFICATION_INCLUDE,
          });

          if (!notification) {
               throw new NotFoundException(`Notification with id ${id} not found`);
          }

          // Customer data isolation
          if (!isAdminRole(actor.role as UserRole) && notification.userId !== actor.id) {
               throw new NotFoundException(`Notification with id ${id} not found`);
          }

          return notification;
     }

     async create(
          dto: CreateNotificationDto,
          actor: { id: string; role: string },
          meta?: RequestMeta,
     ) {
          // Verify user exists
          const user = await this.prisma.user.findFirst({
               where: { id: dto.userId, deletedAt: null },
               select: { id: true, fullName: true },
          });
          if (!user) {
               throw new NotFoundException(`User with id ${dto.userId} not found`);
          }

          const notification = await this.prisma.notification.create({
               data: {
                    userId: dto.userId,
                    type: dto.type || NotificationType.INFO,
                    title: dto.title,
                    message: dto.message,
                    data: dto.data as Prisma.InputJsonValue,
               },
               include: NOTIFICATION_INCLUDE,
          });

          this.logger.log(`Notification created for user ${user.fullName}: ${dto.title}`);

          await this.auditLogService.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.CREATE,
               entity: 'Notification',
               entityId: notification.id,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               afterValue: {
                    userId: dto.userId,
                    type: notification.type,
                    title: dto.title,
               },
               description: `Notification sent to ${user.fullName}: ${dto.title}`,
          });

          return notification;
     }

     /**
      * Internal method to create a notification without audit logging.
      * Used by other services (inquiries) to notify users.
      */
     async notify(
          userId: string,
          type: NotificationType,
          title: string,
          message: string,
          data?: Record<string, any>,
     ): Promise<void> {
          try {
               await this.prisma.notification.create({
                    data: {
                         userId,
                         type,
                         title,
                         message,
                         data: data as Prisma.InputJsonValue,
                    },
               });
               this.logger.log(`Notification sent to ${userId}: ${title}`);
          } catch (error) {
               this.logger.error(
                    `Failed to send notification to ${userId}: ${title}`,
                    (error as Error).stack,
               );
          }
     }

     async update(
          id: string,
          dto: UpdateNotificationDto,
          actor: { id: string; role: string },
          meta?: RequestMeta,
     ) {
          const existing = await this.prisma.notification.findUnique({
               where: { id },
               select: { id: true, userId: true, isRead: true, readAt: true },
          });

          if (!existing) {
               throw new NotFoundException(`Notification with id ${id} not found`);
          }

          // Customer data isolation: customers can only update their own notifications
          if (!isAdminRole(actor.role as UserRole) && existing.userId !== actor.id) {
               throw new ForbiddenException('You can only update your own notifications');
          }

          const data: Prisma.NotificationUpdateInput = {};
          if (dto.isRead !== undefined) {
               data.isRead = dto.isRead;
               data.readAt = dto.isRead ? new Date() : null;
          }

          const updated = await this.prisma.notification.update({
               where: { id },
               data,
               include: NOTIFICATION_INCLUDE,
          });

          this.logger.log(`Notification updated: ${id} by ${actor.id}`);

          await this.auditLogService.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.UPDATE,
               entity: 'Notification',
               entityId: id,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               beforeValue: { isRead: existing.isRead },
               afterValue: { isRead: updated.isRead },
               description: `Notification ${id} marked as ${updated.isRead ? 'read' : 'unread'}`,
          });

          return updated;
     }

     /**
      * Mark a single notification as read.
      */
     async markAsRead(id: string, actor: { id: string; role: string }, meta?: RequestMeta) {
          return this.update(id, { isRead: true }, actor, meta);
     }

     /**
      * Mark all unread notifications as read for a user.
      */
     async markAllAsRead(actor: { id: string; role: string }, meta?: RequestMeta) {
          const result = await this.prisma.notification.updateMany({
               where: {
                    userId: actor.id,
                    isRead: false,
               },
               data: {
                    isRead: true,
                    readAt: new Date(),
               },
          });

          this.logger.log(`${result.count} notifications marked as read by ${actor.id}`);

          await this.auditLogService.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.UPDATE,
               entity: 'Notification',
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               afterValue: { count: result.count, isRead: true },
               description: `${result.count} notifications marked as read`,
          });

          return {
               message: `${result.count} notifications marked as read`,
               count: result.count,
          };
     }

     async remove(
          id: string,
          actor: { id: string; role: string },
          meta?: RequestMeta,
     ) {
          const existing = await this.prisma.notification.findUnique({
               where: { id },
               select: { id: true, userId: true, title: true },
          });

          if (!existing) {
               throw new NotFoundException(`Notification with id ${id} not found`);
          }

          // Customer data isolation: customers can only delete their own notifications
          if (!isAdminRole(actor.role as UserRole) && existing.userId !== actor.id) {
               throw new ForbiddenException('You can only delete your own notifications');
          }

          await this.prisma.notification.delete({
               where: { id },
          });

          this.logger.log(`Notification deleted: ${id} by ${actor.id}`);

          await this.auditLogService.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.DELETE,
               entity: 'Notification',
               entityId: id,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               beforeValue: { title: existing.title },
               description: `Notification ${id} deleted`,
          });

          return { message: 'Notification deleted successfully' };
     }

     /**
      * Get unread notification count for a user.
      */
     async getUnreadCount(userId: string) {
          const count = await this.prisma.notification.count({
               where: { userId, isRead: false },
          });

          return { unreadCount: count };
     }
}
