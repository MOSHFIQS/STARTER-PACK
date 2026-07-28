import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../../common/constants';

/**
 * Roles decorator
 * Restricts a route to specific roles. Used with RolesGuard.
 * @example
 * @Roles(UserRole.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
