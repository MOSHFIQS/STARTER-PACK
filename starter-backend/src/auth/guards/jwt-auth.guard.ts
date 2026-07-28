import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_KEY } from '../../common/constants';

/**
 * JWT Authentication Guard
 * Protects routes by validating the Bearer access token.
 * Routes marked with @Public() bypass authentication.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
     constructor(private reflector: Reflector) {
          super();
     }

     canActivate(context: ExecutionContext) {
          const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
               context.getHandler(),
               context.getClass(),
          ]);

          if (isPublic) {
               return true;
          }

          return super.canActivate(context);
     }
}
