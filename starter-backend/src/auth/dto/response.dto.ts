import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class AuthUserResponseDto {
     @ApiProperty()
     id: string;

     @ApiProperty()
     email: string;

     @ApiProperty()
     firstName: string;

     @ApiProperty()
     lastName: string;

     @ApiProperty()
     fullName: string;

     @ApiProperty({ enum: UserRole })
     role: UserRole;

     @ApiProperty()
     avatarUrl?: string;
}

export class AuthResponseDto {
     @ApiProperty({
          description: 'Authenticated user profile. The JWT auth token is set as an HttpOnly cookie (not exposed in the response body).',
          type: AuthUserResponseDto,
     })
     user: AuthUserResponseDto;
}

/**
 * Internal auth result returned by AuthService.generateAuthResponse().
 * Contains the access token (used by the controller to set the HttpOnly cookie)
 * alongside the user profile. Never serialized directly to the client — the
 * controller strips the token and returns only `{ user }`.
 */
export interface AuthResult {
     accessToken: string;
     tokenType: string;
     expiresIn: string;
     user: AuthUserResponseDto;
}

export interface JwtPayload {
     sub: string;
     email: string;
     role: UserRole;
     iat?: number;
     exp?: number;
}
