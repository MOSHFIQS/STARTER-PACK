import {
     CanActivate,
     ExecutionContext,
     ForbiddenException,
     Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { hasRoleAccess, ROLES_KEY } from '../../common/constants';

/**
 * Roles Guard — Hierarchical RBAC
 *
 * Enforces role-based authorization. Must be used after JwtAuthGuard.
 * Roles are checked against the @Roles() decorator metadata.
 *
 * Hierarchical model (SUPER_ADMIN > ADMIN > CUSTOMER):
 *   - A route decorated with @Roles(UserRole.ADMIN) is accessible by both
 *     ADMIN and SUPER_ADMIN (super admin inherits admin permissions).
 *   - A route decorated with @Roles(UserRole.SUPER_ADMIN) is ONLY accessible
 *     by SUPER_ADMIN.
 *   - A route decorated with @Roles(UserRole.CUSTOMER) is accessible by all
 *     authenticated users.
 */
@Injectable()
export class RolesGuard implements CanActivate {
     constructor(private reflector: Reflector) { }

     canActivate(context: ExecutionContext): boolean {
          const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
               ROLES_KEY,
               [context.getHandler(), context.getClass()],
          );

          if (!requiredRoles || requiredRoles.length === 0) {
               return true;
          }

          const request = context.switchToHttp().getRequest();
          const user = request.user;

          if (!user) {
               throw new ForbiddenException('User not authenticated');
          }

          if (!hasRoleAccess(user.role as UserRole, requiredRoles)) {
               throw new ForbiddenException(
                    `Access denied. Required role: ${requiredRoles.join(', ')}`,
               );
          }

          return true;
     }
}
