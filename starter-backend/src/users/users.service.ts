import {
     BadRequestException,
     ConflictException,
     ForbiddenException,
     Injectable,
     Logger,
     NotFoundException,
     UnauthorizedException,
} from '@nestjs/common';
import { AuditAction, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CLOUDINARY_FOLDERS, isSuperAdminRole } from '../common/constants';
import { buildPaginationMeta } from '../common/interfaces/response.interface';
import { PrismaService } from '../common/prisma/prisma.service';
import {
     buildOrderBy,
     buildPagination,
     buildSearchFilter,
     mergeWhere,
} from '../common/utils/pagination.util';
import { parseMultipartDto, toDate } from '../common/utils/multipart';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ChangePasswordDto, UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Fields returned for a user (never exposes password).
 */
const USER_PUBLIC_FIELDS = {
     id: true,
     email: true,
     phone: true,
     firstName: true,
     lastName: true,
     fullName: true,
     role: true,
     status: true,
     avatarUrl: true,
     bio: true,
     address: true,
     city: true,
     country: true,
     postalCode: true,
     gender: true,
     dateOfBirth: true,
     emailVerified: true,
     phoneVerified: true,
     lastLoginAt: true,
     lastLoginIp: true,
     lastDevice: true,
     createdAt: true,
     updatedAt: true,
} as const;

export interface RequestMeta {
     ipAddress?: string;
     device?: string;
     userAgent?: string;
}

@Injectable()
export class UsersService {
     private readonly logger = new Logger(UsersService.name);

     constructor(
          private readonly prisma: PrismaService,
          private readonly auditLogService: AuditLogService,
          private readonly cloudinaryService: CloudinaryService,
     ) { }

     /**
      * List all users with pagination, search, and filtering (Admin only).
      */
     async findAll(dto: FilterUserDto) {
          const where = mergeWhere(
               { deletedAt: null },
               buildSearchFilter(dto.search, [
                    'firstName',
                    'lastName',
                    'fullName',
                    'email',
                    'phone',
               ]),
               dto.role ? { role: dto.role } : undefined,
               dto.status ? { status: dto.status } : undefined,
               dto.city ? { city: { contains: dto.city, mode: 'insensitive' } } : undefined,
               dto.country
                    ? { country: { contains: dto.country, mode: 'insensitive' } }
                    : undefined,
          );

          const [items, total] = await Promise.all([
               this.prisma.user.findMany({
                    where,
                    ...buildPagination(dto.page, dto.limit),
                    orderBy: buildOrderBy(dto.sortBy, dto.sortOrder),
                    select: USER_PUBLIC_FIELDS,
               }),
               this.prisma.user.count({ where }),
          ]);

          return {
               data: items,
               meta: buildPaginationMeta(total, dto.page || 1, dto.limit || 10),
          };
     }

     /**
      * Get a single user by ID (Admin only).
      */
     async findOne(id: string) {
          const user = await this.prisma.user.findFirst({
               where: { id, deletedAt: null },
               select: USER_PUBLIC_FIELDS,
          });

          if (!user) {
               throw new NotFoundException(`User with id ${id} not found`);
          }

          return user;
     }

     /**
      * Create a new user (Admin only).
      */
     async create(dto: CreateUserDto, actor: { id: string; role: UserRole }, meta?: RequestMeta) {
          const existing = await this.prisma.user.findFirst({
               where: {
                    OR: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])],
                    deletedAt: null,
               },
               select: { id: true },
          });

          if (existing) {
               throw new ConflictException('User with this email or phone already exists');
          }

          // Only a Super Admin can create another Super Admin.
          if (dto.role === UserRole.SUPER_ADMIN && !isSuperAdminRole(actor.role)) {
               throw new ForbiddenException(
                    'Only a Super Admin can create Super Admin accounts.',
               );
          }

          const hashedPassword = await bcrypt.hash(dto.password, 10);
          const fullName = `${dto.firstName} ${dto.lastName}`;

          const user = await this.prisma.user.create({
               data: {
                    email: dto.email,
                    phone: dto.phone,
                    password: hashedPassword,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    fullName,
                    role: dto.role || UserRole.CUSTOMER,
                    status: dto.status || UserStatus.ACTIVE,
               },
               select: USER_PUBLIC_FIELDS,
          });

          this.logger.log(`User created: ${user.email} by admin ${actor.id}`);

          await this.auditLogService.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.CREATE,
               entity: 'User',
               entityId: user.id,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               afterValue: { email: user.email, role: user.role, status: user.status },
               description: `Admin created user ${user.email} (${user.role})`,
          });

          return user;
     }

     /**
      * Update a user (Admin only).
      */
     async update(
          id: string,
          dto: UpdateUserDto,
          actor: { id: string; role: UserRole },
          meta?: RequestMeta,
     ) {
          const existing = await this.prisma.user.findFirst({
               where: { id, deletedAt: null },
               select: { id: true, email: true, phone: true, role: true, status: true, firstName: true, lastName: true },
          });

          if (!existing) {
               throw new NotFoundException(`User with id ${id} not found`);
          }

          // Self-protection: a user cannot change their own role or status via this endpoint.
          if (actor.id === id) {
               if (dto.role && dto.role !== existing.role) {
                    throw new ForbiddenException(
                         'You cannot change your own role. Ask another admin.',
                    );
               }
               if (dto.status && dto.status !== existing.status) {
                    throw new ForbiddenException(
                         'You cannot change your own status. Ask another admin.',
                    );
               }
          }

          // Hierarchical RBAC: an Admin cannot modify a Super Admin account.
          if (isSuperAdminRole(existing.role) && !isSuperAdminRole(actor.role)) {
               throw new ForbiddenException(
                    'Admins cannot modify Super Admin accounts. Only a Super Admin can do this.',
               );
          }

          // Only a Super Admin can grant or revoke the Super Admin role.
          if (
               dto.role &&
               (dto.role === UserRole.SUPER_ADMIN || existing.role === UserRole.SUPER_ADMIN) &&
               !isSuperAdminRole(actor.role)
          ) {
               throw new ForbiddenException(
                    'Only a Super Admin can assign or revoke the Super Admin role.',
               );
          }

          // Last-super-admin guard: prevent demoting the last active Super Admin.
          if (
               existing.role === UserRole.SUPER_ADMIN &&
               dto.role &&
               dto.role !== UserRole.SUPER_ADMIN
          ) {
               await this.ensureNotLastSuperAdmin(id);
          }

          // Last-super-admin guard: prevent deactivating the last active Super Admin.
          if (
               existing.role === UserRole.SUPER_ADMIN &&
               dto.status === UserStatus.INACTIVE
          ) {
               await this.ensureNotLastSuperAdmin(id);
          }

          // Uniqueness checks for email/phone
          if (dto.email && dto.email !== existing.email) {
               const emailTaken = await this.prisma.user.findFirst({
                    where: { email: dto.email, NOT: { id }, deletedAt: null },
                    select: { id: true },
               });
               if (emailTaken) {
                    throw new ConflictException('Email already in use');
               }
          }
          if (dto.phone && dto.phone !== existing.phone) {
               const phoneTaken = await this.prisma.user.findFirst({
                    where: { phone: dto.phone, NOT: { id }, deletedAt: null },
                    select: { id: true },
               });
               if (phoneTaken) {
                    throw new ConflictException('Phone already in use');
               }
          }

          const data: Record<string, any> = {};
          if (dto.email) data.email = dto.email;
          if (dto.phone !== undefined) data.phone = dto.phone;
          if (dto.firstName) {
               data.firstName = dto.firstName;
               data.fullName = `${dto.firstName} ${dto.lastName ?? existing.lastName}`;
          }
          if (dto.lastName) {
               data.lastName = dto.lastName;
               data.fullName = `${dto.firstName ?? existing.firstName} ${dto.lastName}`;
          }
          if (dto.role) data.role = dto.role;
          if (dto.status) data.status = dto.status;
          if (dto.password) {
               data.password = await bcrypt.hash(dto.password, 10);
          }

          const updated = await this.prisma.user.update({
               where: { id },
               data,
               select: USER_PUBLIC_FIELDS,
          });

          this.logger.log(`User updated: ${updated.email} by admin ${actor.id}`);

          await this.auditLogService.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.UPDATE,
               entity: 'User',
               entityId: id,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               beforeValue: {
                    email: existing.email,
                    role: existing.role,
                    status: existing.status,
               },
               afterValue: {
                    email: updated.email,
                    role: updated.role,
                    status: updated.status,
               },
               description: `Admin updated user ${updated.email}`,
          });

          return updated;
     }

     /**
      * Soft delete a user (Admin only) with self-deletion protection.
      */
     async remove(
          id: string,
          actor: { id: string; role: UserRole },
          meta?: RequestMeta,
     ) {
          // Self-protection: a user cannot delete their own account.
          if (actor.id === id) {
               throw new ForbiddenException(
                    'You cannot delete your own account. Ask another admin.',
               );
          }

          const existing = await this.prisma.user.findFirst({
               where: { id, deletedAt: null },
               select: { id: true, email: true, role: true },
          });

          if (!existing) {
               throw new NotFoundException(`User with id ${id} not found`);
          }

          // Hierarchical RBAC: an Admin cannot delete a Super Admin account.
          if (isSuperAdminRole(existing.role) && !isSuperAdminRole(actor.role)) {
               throw new ForbiddenException(
                    'Admins cannot delete Super Admin accounts. Only a Super Admin can do this.',
               );
          }

          // Last-super-admin guard: prevent deleting the last active Super Admin.
          if (existing.role === UserRole.SUPER_ADMIN) {
               await this.ensureNotLastSuperAdmin(id);
          }

          await this.prisma.user.update({
               where: { id },
               data: { deletedAt: new Date(), status: UserStatus.INACTIVE },
          });

          this.logger.log(`User deleted: ${existing.email} by admin ${actor.id}`);

          await this.auditLogService.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.SOFT_DELETE,
               entity: 'User',
               entityId: id,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               beforeValue: { email: existing.email, role: existing.role },
               description: `Admin deleted user ${existing.email}`,
          });

          return { message: 'User deleted successfully' };
     }

     /**
      * Update the authenticated user's own profile (self only).
      */
     async updateProfile(
          userId: string,
          data: string,
          file: Express.Multer.File,
          meta?: RequestMeta,
     ) {
          const dto = await parseMultipartDto(data, UpdateProfileDto);

          const existing = await this.prisma.user.findFirst({
               where: { id: userId, deletedAt: null },
               select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    email: true,
                    role: true,
               },
          });

          if (!existing) {
               throw new NotFoundException('User not found');
          }

          // Phone uniqueness check
          if (dto.phone && dto.phone !== existing.phone) {
               const phoneTaken = await this.prisma.user.findFirst({
                    where: { phone: dto.phone, NOT: { id: userId }, deletedAt: null },
                    select: { id: true },
               });
               if (phoneTaken) {
                    throw new ConflictException('Phone already in use');
               }
          }

          const updateData: Record<string, any> = {};
          if (dto.firstName) updateData.firstName = dto.firstName;
          if (dto.lastName) updateData.lastName = dto.lastName;
          if (dto.firstName || dto.lastName) {
               updateData.fullName = `${dto.firstName ?? existing.firstName} ${dto.lastName ?? existing.lastName}`;
          }
          if (dto.phone !== undefined) updateData.phone = dto.phone;
          if (dto.bio !== undefined) updateData.bio = dto.bio;
          if (dto.address !== undefined) updateData.address = dto.address;
          if (dto.city !== undefined) updateData.city = dto.city;
          if (dto.country !== undefined) updateData.country = dto.country;
          if (dto.postalCode !== undefined) updateData.postalCode = dto.postalCode;
          if (dto.gender !== undefined) updateData.gender = dto.gender;
          if (dto.dateOfBirth !== undefined) {
               updateData.dateOfBirth = toDate(dto.dateOfBirth);
          }

          // Avatar handling: upload new file if provided, otherwise keep existing URL
          if (file) {
               const uploaded = await this.cloudinaryService.uploadImage(
                    file,
                    CLOUDINARY_FOLDERS.PROFILES,
               );
               updateData.avatarUrl = uploaded.secureUrl;
          } else if (dto.avatarUrl !== undefined) {
               updateData.avatarUrl = dto.avatarUrl;
          }

          const updated = await this.prisma.user.update({
               where: { id: userId },
               data: updateData,
               select: USER_PUBLIC_FIELDS,
          });

          this.logger.log(`Profile updated by user ${userId}`);

          await this.auditLogService.log({
               userId,
               role: existing.role,
               action: AuditAction.PROFILE_CHANGE,
               entity: 'User',
               entityId: userId,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               afterValue: updateData,
               description: `User updated their profile`,
          });

          return updated;
     }

     /**
      * Change the authenticated user's own password (self only).
      */
     async changePassword(
          userId: string,
          dto: ChangePasswordDto,
          meta?: RequestMeta,
     ) {
          const user = await this.prisma.user.findFirst({
               where: { id: userId, deletedAt: null },
               select: { id: true, password: true, email: true, role: true },
          });

          if (!user) {
               throw new NotFoundException('User not found');
          }

          const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
          if (!isMatch) {
               throw new UnauthorizedException('Current password is incorrect');
          }

          if (dto.currentPassword === dto.newPassword) {
               throw new BadRequestException(
                    'New password must be different from the current password',
               );
          }

          const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

          await this.prisma.user.update({
               where: { id: userId },
               data: { password: hashedPassword },
          });

          this.logger.log(`Password changed by user ${userId}`);

          await this.auditLogService.log({
               userId,
               role: user.role,
               action: AuditAction.PROFILE_CHANGE,
               entity: 'User',
               entityId: userId,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               description: `User changed their password`,
          });

          return { message: 'Password changed successfully' };
     }

     /**
      * Update a user's role (Admin only) with self-role-change protection.
      */
     async updateRole(
          id: string,
          role: UserRole,
          actor: { id: string; role: UserRole },
          meta?: RequestMeta,
     ) {
          // Self-protection: a user cannot change their own role.
          if (actor.id === id) {
               throw new ForbiddenException(
                    'You cannot change your own role. Ask another admin.',
               );
          }

          const existing = await this.prisma.user.findFirst({
               where: { id, deletedAt: null },
               select: { id: true, email: true, role: true },
          });

          if (!existing) {
               throw new NotFoundException(`User with id ${id} not found`);
          }

          if (existing.role === role) {
               throw new BadRequestException('User already has this role');
          }

          // Hierarchical RBAC: an Admin cannot modify a Super Admin's role.
          if (isSuperAdminRole(existing.role) && !isSuperAdminRole(actor.role)) {
               throw new ForbiddenException(
                    'Admins cannot modify Super Admin roles. Only a Super Admin can do this.',
               );
          }

          // Only a Super Admin can assign the Super Admin role.
          if (role === UserRole.SUPER_ADMIN && !isSuperAdminRole(actor.role)) {
               throw new ForbiddenException(
                    'Only a Super Admin can assign the Super Admin role.',
               );
          }

          // Last-super-admin guard: prevent demoting the last active Super Admin.
          if (existing.role === UserRole.SUPER_ADMIN && role !== UserRole.SUPER_ADMIN) {
               await this.ensureNotLastSuperAdmin(id);
          }

          const updated = await this.prisma.user.update({
               where: { id },
               data: { role },
               select: USER_PUBLIC_FIELDS,
          });

          this.logger.log(
               `Role changed for ${existing.email}: ${existing.role} -> ${role} by admin ${actor.id}`,
          );

          await this.auditLogService.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.ROLE_CHANGE,
               entity: 'User',
               entityId: id,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               beforeValue: { role: existing.role },
               afterValue: { role },
               description: `Admin changed role of ${existing.email} from ${existing.role} to ${role}`,
          });

          return updated;
     }

     /**
      * Update a user's status (Admin only) with self-deactivation protection.
      */
     async updateStatus(
          id: string,
          status: UserStatus,
          actor: { id: string; role: UserRole },
          meta?: RequestMeta,
     ) {
          // Self-protection: a user cannot change their own status.
          if (actor.id === id) {
               throw new ForbiddenException(
                    'You cannot change your own status. Ask another admin.',
               );
          }

          const existing = await this.prisma.user.findFirst({
               where: { id, deletedAt: null },
               select: { id: true, email: true, role: true, status: true },
          });

          if (!existing) {
               throw new NotFoundException(`User with id ${id} not found`);
          }

          if (existing.status === status) {
               throw new BadRequestException('User already has this status');
          }

          // Hierarchical RBAC: an Admin cannot change a Super Admin's status.
          if (isSuperAdminRole(existing.role) && !isSuperAdminRole(actor.role)) {
               throw new ForbiddenException(
                    'Admins cannot modify Super Admin status. Only a Super Admin can do this.',
               );
          }

          // Last-super-admin guard: prevent deactivating the last active Super Admin.
          if (
               existing.role === UserRole.SUPER_ADMIN &&
               status === UserStatus.INACTIVE
          ) {
               await this.ensureNotLastSuperAdmin(id);
          }

          const updated = await this.prisma.user.update({
               where: { id },
               data: { status },
               select: USER_PUBLIC_FIELDS,
          });

          this.logger.log(
               `Status changed for ${existing.email}: ${existing.status} -> ${status} by admin ${actor.id}`,
          );

          await this.auditLogService.log({
               userId: actor.id,
               role: actor.role,
               action: AuditAction.STATUS_CHANGE,
               entity: 'User',
               entityId: id,
               ipAddress: meta?.ipAddress,
               device: meta?.device,
               userAgent: meta?.userAgent,
               beforeValue: { status: existing.status },
               afterValue: { status },
               description: `Admin changed status of ${existing.email} from ${existing.status} to ${status}`,
          });

          return updated;
     }

     /**
      * Last-super-admin guard: ensures the system always retains at least one
      * active Super Admin. Throws if the target user is the last active Super Admin.
      */
     private async ensureNotLastSuperAdmin(targetId: string): Promise<void> {
          const activeSuperAdmins = await this.prisma.user.count({
               where: {
                    role: UserRole.SUPER_ADMIN,
                    status: UserStatus.ACTIVE,
                    deletedAt: null,
                    NOT: { id: targetId },
               },
          });

          if (activeSuperAdmins === 0) {
               throw new ForbiddenException(
                    'Cannot perform this action: the system must always have at least one active Super Admin.',
               );
          }
     }
}
