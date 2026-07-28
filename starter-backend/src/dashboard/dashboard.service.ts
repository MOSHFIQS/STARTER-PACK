import { Injectable, Logger } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DashboardService {
     private readonly logger = new Logger(DashboardService.name);

     constructor(private readonly prisma: PrismaService) { }

     /**
      * Admin overview: high-level counts and pending items across the platform.
      */
     async getAdminOverview() {
          const [
               totalUsers,
               totalCustomers,
               totalAdmins,
               totalSuperAdmins,
               unreadNotifications,
          ] = await Promise.all([
               this.prisma.user.count({ where: { deletedAt: null } }),
               this.prisma.user.count({ where: { role: UserRole.CUSTOMER, deletedAt: null } }),
               this.prisma.user.count({ where: { role: UserRole.ADMIN, deletedAt: null } }),
               this.prisma.user.count({ where: { role: UserRole.SUPER_ADMIN, deletedAt: null } }),
               this.prisma.notification.count({ where: { isRead: false } }),
          ]);

          return {
               counts: {
                    users: totalUsers,
                    customers: totalCustomers,
                    admins: totalAdmins,
                    superAdmins: totalSuperAdmins,
               },
               pending: {
                    notifications: unreadNotifications,
               },
          };
     }

     /**
      * User statistics: active, inactive, by role.
      */
     async getUserStats() {
          const [total, active, inactive, customers, admins, superAdmins] = await Promise.all([
               this.prisma.user.count({ where: { deletedAt: null } }),
               this.prisma.user.count({ where: { status: UserStatus.ACTIVE, deletedAt: null } }),
               this.prisma.user.count({ where: { status: UserStatus.INACTIVE, deletedAt: null } }),
               this.prisma.user.count({ where: { role: UserRole.CUSTOMER, deletedAt: null } }),
               this.prisma.user.count({ where: { role: UserRole.ADMIN, deletedAt: null } }),
               this.prisma.user.count({ where: { role: UserRole.SUPER_ADMIN, deletedAt: null } }),
          ]);

          return {
               total,
               active,
               inactive,
               customers,
               admins,
               superAdmins,
          };
     }

     /**
      * Recent registrations (latest 10).
      */
     async getRecentUsers(limit = 10) {
          return this.prisma.user.findMany({
               where: { deletedAt: null },
               take: limit,
               orderBy: { createdAt: 'desc' },
               select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    status: true,
                    createdAt: true,
               },
          });
     }
}
