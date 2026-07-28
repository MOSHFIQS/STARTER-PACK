import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { COOKIE_NAMES } from '../cookie.config';
import { JwtPayload } from '../dto/response.dto';

/**
 * JWT Strategy — extracts the auth token from TWO sources:
 * 1. `authToken` HttpOnly cookie (primary — used by browser)
 * 2. `Authorization: Bearer <token>` header (secondary — used by mobile / Swagger)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
     constructor(
          private readonly configService: ConfigService,
          private readonly authService: AuthService,
     ) {
          super({
               jwtFromRequest: ExtractJwt.fromExtractors([
                    // Extract from authToken cookie (browser-based auth)
                    (req: Request): string | null => {
                         let token: string | null = null;
                         if (req && req.cookies) {
                              token = req.cookies[COOKIE_NAMES.AUTH_TOKEN] ?? null;
                         }
                         return token;
                    },
                    // Fallback: Bearer header (Swagger, mobile apps, API clients)
                    ExtractJwt.fromAuthHeaderAsBearerToken(),
               ]),
               ignoreExpiration: false,
               secretOrKey: configService.get<string>('jwt.secret', 'super-secret-key'),
          });
     }

     async validate(payload: JwtPayload) {
          // Defensive check: ensure the JWT actually contains a valid sub claim
          if (!payload?.sub) {
               throw new UnauthorizedException('Invalid token: user identifier missing');
          }

          const user = await this.authService.validateUserById(payload.sub);
          if (!user) {
               throw new UnauthorizedException('Invalid token');
          }
          return {
               id: user.id,
               email: user.email,
               role: user.role,
               status: user.status,
               firstName: user.firstName,
               lastName: user.lastName,
          };
     }
}
