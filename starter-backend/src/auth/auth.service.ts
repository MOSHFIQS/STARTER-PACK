import {
     ConflictException,
     Injectable,
     Logger,
     NotFoundException,
     UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuditLogService } from '../audit-log/audit-log.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResult, JwtPayload } from './dto/response.dto';

@Injectable()
export class AuthService {
     private readonly logger = new Logger(AuthService.name);

     constructor(
          private readonly prisma: PrismaService,
          private readonly jwtService: JwtService,
          private readonly configService: ConfigService,
          private readonly auditLogService: AuditLogService,
     ) { }

     /**
      * Register a new customer account.
      */
     async register(
          dto: RegisterDto,
          metadata?: { ipAddress?: string; device?: string; userAgent?: string },
     ): Promise<AuthResult> {
          const existing = await this.prisma.user.findFirst({
               where: {
                    OR: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])],
                    deletedAt: null,
               },
          });

          if (existing) {
               throw new ConflictException('User with this email or phone already exists');
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
                    role: UserRole.CUSTOMER,
                    status: UserStatus.ACTIVE,
               },
          });

          this.logger.log(`New user registered: ${user.email}`);

          await this.auditLogService.log({
               userId: user.id,
               role: user.role,
               action: 'LOGIN',
               entity: 'User',
               entityId: user.id,
               ipAddress: metadata?.ipAddress,
               device: metadata?.device,
               userAgent: metadata?.userAgent,
               description: `User registered: ${user.email}`,
          });

          return this.generateAuthResponse(user);
     }

     /**
      * Login with email and password.
      */
     async login(
          dto: LoginDto,
          metadata?: { ipAddress?: string; device?: string; userAgent?: string },
     ): Promise<AuthResult> {
          const user = await this.prisma.user.findFirst({
               where: { email: dto.email, deletedAt: null },
          });

          if (!user) {
               throw new UnauthorizedException('Invalid credentials');
          }

          const isPasswordValid = await bcrypt.compare(dto.password, user.password);
          if (!isPasswordValid) {
               throw new UnauthorizedException('Invalid credentials');
          }

          if (user.status !== UserStatus.ACTIVE) {
               throw new UnauthorizedException(
                    `Account is ${user.status.toLowerCase()}. Please contact support.`,
               );
          }

          await this.prisma.user.update({
               where: { id: user.id },
               data: {
                    lastLoginAt: new Date(),
                    lastLoginIp: metadata?.ipAddress,
                    lastDevice: metadata?.device,
               },
          });

          this.logger.log(`User logged in: ${user.email}`);

          await this.auditLogService.log({
               userId: user.id,
               role: user.role,
               action: 'LOGIN',
               entity: 'User',
               entityId: user.id,
               ipAddress: metadata?.ipAddress,
               device: metadata?.device,
               userAgent: metadata?.userAgent,
               description: `User logged in: ${user.email}`,
          });

          return this.generateAuthResponse(user);
     }

     /**
      * Logout - logs the audit event. (Access token only, no blacklist.)
      */
     async logout(
          userId: string,
          metadata?: { ipAddress?: string; device?: string; userAgent?: string },
     ): Promise<{ message: string }> {
          const user = await this.prisma.user.findFirst({
               where: { id: userId, deletedAt: null },
               select: { id: true, email: true, role: true },
          });

          if (user) {
               await this.auditLogService.log({
                    userId: user.id,
                    role: user.role,
                    action: 'LOGOUT',
                    entity: 'User',
                    entityId: user.id,
                    ipAddress: metadata?.ipAddress,
                    device: metadata?.device,
                    userAgent: metadata?.userAgent,
                    description: `User logged out: ${user.email}`,
               });
          }

          return { message: 'Logged out successfully' };
     }

     /**
      * Get the current authenticated user's profile.
      */
     async getProfile(userId: string) {
          const user = await this.prisma.user.findFirst({
               where: { id: userId, deletedAt: null },
               select: {
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
                    createdAt: true,
                    updatedAt: true,
               },
          });

          if (!user) {
               throw new NotFoundException('User not found');
          }

          return user;
     }

     /**
      * Validate user by ID (used by JWT strategy).
      */
     async validateUserById(userId: string) {
          const user = await this.prisma.user.findFirst({
               where: { id: userId, deletedAt: null },
          });

          if (!user) {
               throw new UnauthorizedException('User not found or deleted');
          }

          if (user.status !== UserStatus.ACTIVE) {
               throw new UnauthorizedException(`Account is ${user.status.toLowerCase()}`);
          }

          return user;
     }

     /**
      * Generate JWT access token and auth response.
      */
     private generateAuthResponse(user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          fullName: string;
          role: UserRole;
          avatarUrl: string | null;
     }): AuthResult {
          const payload: JwtPayload = {
               sub: user.id,
               email: user.email,
               role: user.role,
          };

          const expiresIn = this.configService.get<string>('jwt.expiresIn', '1d');
          const accessToken = this.jwtService.sign(payload);

          return {
               accessToken,
               tokenType: 'Bearer',
               expiresIn,
               user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    fullName: user.fullName,
                    role: user.role,
                    avatarUrl: user.avatarUrl || undefined,
               },
          };
     }
}
