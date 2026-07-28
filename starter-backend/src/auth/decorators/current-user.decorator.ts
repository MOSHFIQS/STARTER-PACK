import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export interface AuthUser {
     id: string;
     email: string;
     role: UserRole;
     status: string;
     firstName: string;
     lastName: string;
}

/**
 * CurrentUser decorator
 * Extracts the authenticated user from the request object.
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthUser) { ... }
 */
export const CurrentUser = createParamDecorator(
     (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
          const request = ctx.switchToHttp().getRequest();
          const user = request.user as AuthUser;

          if (!user) return null;
          return data ? user[data] : user;
     },
);
