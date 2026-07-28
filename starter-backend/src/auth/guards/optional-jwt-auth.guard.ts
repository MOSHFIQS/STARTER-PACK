import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT Authentication Guard
 *
 * Attempts to authenticate the user from the JWT cookie / Bearer header but
 * does NOT require authentication.
 *
 *  - Valid token present  → request.user is populated with the AuthUser.
 *  - No token / invalid   → request.user is null (anonymous), request proceeds.
 *
 * Use this on public endpoints that benefit from knowing the authenticated
 * user when one is available (e.g. linking a contact-form inquiry to the
 * logged-in customer's account so it shows up in their dashboard).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
     handleRequest<TUser = any>(err: any, user: any): TUser {
          // Never throw — missing or invalid tokens simply mean "anonymous".
          return user || null;
     }
}
