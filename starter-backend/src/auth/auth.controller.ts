import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
     ApiBearerAuth,
     ApiBody,
     ApiOperation,
     ApiResponse,
     ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
     authTokenCookieOptions,
     COOKIE_NAMES,
     getCookieOptions,
} from './cookie.config';
import { AuthUser, CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
     private readonly isProd = process.env.NODE_ENV === 'production';

     constructor(private readonly authService: AuthService) { }

     @Public()
     @Post('register')
     @Throttle({ default: { limit: 5, ttl: 60000 } })
     @ApiOperation({
          summary: 'Register a new customer account',
          description:
               'Creates a new customer account with email and password. Sets a JWT auth token as an HttpOnly cookie. Rate limited to 5 requests per minute.',
     })
     @ApiBody({ type: RegisterDto })
     @ApiResponse({
          status: 201,
          description: 'Account created successfully. Auth token set as an HttpOnly cookie.',
          type: AuthResponseDto,
     })
     @ApiResponse({ status: 409, description: 'Email or phone already exists' })
     @ApiResponse({ status: 400, description: 'Validation failed' })
     async register(
          @Body() dto: RegisterDto,
          @Req() req: Request,
          @Res({ passthrough: true }) res: Response,
     ) {
          const result = await this.authService.register(dto, this.extractMeta(req));

          // Backend owns the token: set one HttpOnly cookie and never expose it to JS.
          res.cookie(
               COOKIE_NAMES.AUTH_TOKEN,
               result.accessToken,
               authTokenCookieOptions(this.isProd),
          );

          return { user: result.user };
     }

     @Public()
     @Post('login')
     @Throttle({ default: { limit: 5, ttl: 60000 } })
     @ApiOperation({
          summary: 'Login with email and password',
          description:
               'Authenticates a user and sets a JWT auth token as an HttpOnly cookie. Rate limited to 5 requests per minute.',
     })
     @ApiBody({ type: LoginDto })
     @ApiResponse({
          status: 200,
          description: 'Login successful. Auth token set as an HttpOnly cookie.',
          type: AuthResponseDto,
     })
     @ApiResponse({ status: 401, description: 'Invalid credentials' })
     async login(
          @Body() dto: LoginDto,
          @Req() req: Request,
          @Res({ passthrough: true }) res: Response,
     ) {
          const result = await this.authService.login(dto, this.extractMeta(req));

          // Backend owns the token: set one HttpOnly cookie and never expose it to JS.
          res.cookie(
               COOKIE_NAMES.AUTH_TOKEN,
               result.accessToken,
               authTokenCookieOptions(this.isProd),
          );

          return { user: result.user };
     }

     @Post('logout')
     @UseGuards(JwtAuthGuard)
     @ApiBearerAuth('JWT-auth')
     @ApiOperation({
          summary: 'Logout current session',
          description:
               'Logs the logout audit event and clears the HttpOnly auth token cookie.',
     })
     @ApiResponse({ status: 200, description: 'Logged out successfully' })
     async logout(
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
          @Res({ passthrough: true }) res: Response,
     ) {
          const result = await this.authService.logout(user.id, this.extractMeta(req));

          // Clear using the same path/security options used when issuing the cookie.
          res.clearCookie(COOKIE_NAMES.AUTH_TOKEN, getCookieOptions(this.isProd));

          return result;
     }

     @Get('me')
     @UseGuards(JwtAuthGuard)
     @ApiBearerAuth('JWT-auth')
     @ApiOperation({
          summary: 'Get current user profile',
          description:
               'Returns the authenticated user profile. Validates the HttpOnly auth cookie.',
     })
     @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
     @ApiResponse({ status: 401, description: 'Unauthorized' })
     getProfile(@CurrentUser() user: AuthUser) {
          return this.authService.getProfile(user.id);
     }

     private extractMeta(req: Request) {
          return {
               ipAddress: req.ip || req.socket?.remoteAddress,
               device: req.get('user-agent'),
               userAgent: req.get('user-agent'),
          };
     }
}
