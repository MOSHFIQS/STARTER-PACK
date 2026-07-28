import {
     Body,
     Controller,
     Delete,
     Get,
     Param,
     Patch,
     Post,
     Query,
     Req,
     UploadedFile,
     UseGuards,
     UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
     ApiBearerAuth,
     ApiBody,
     ApiConsumes,
     ApiOperation,
     ApiQuery,
     ApiResponse,
     ApiTags,
} from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { Request } from 'express';
import { AuthUser, CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ChangePasswordDto, UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
     constructor(private readonly usersService: UsersService) { }

     @Get()
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: 'List all users (Admin only)',
          description:
               'Retrieve a paginated list of users with search and filtering by role, status, city, country.',
     })
     @ApiQuery({ name: 'page', required: false, type: Number })
     @ApiQuery({ name: 'limit', required: false, type: Number })
     @ApiQuery({ name: 'search', required: false, type: String })
     @ApiQuery({ name: 'role', required: false, enum: UserRole })
     @ApiQuery({ name: 'status', required: false, enum: UserStatus })
     @ApiQuery({ name: 'city', required: false, type: String })
     @ApiQuery({ name: 'country', required: false, type: String })
     @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
     @ApiResponse({ status: 403, description: 'Admin access required' })
     findAll(@Query() dto: FilterUserDto) {
          return this.usersService.findAll(dto);
     }

     @Get(':id')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({ summary: 'Get a user by ID (Admin only)' })
     @ApiResponse({ status: 200, description: 'User retrieved successfully' })
     @ApiResponse({ status: 404, description: 'User not found' })
     findOne(@Param('id') id: string) {
          return this.usersService.findOne(id);
     }

     @Post()
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: 'Create a new user (Admin only)',
          description: 'Creates a user with the given role and status.',
     })
     @ApiBody({ type: CreateUserDto })
     @ApiResponse({ status: 201, description: 'User created successfully' })
     @ApiResponse({ status: 409, description: 'Email or phone already exists' })
     create(
          @Body() dto: CreateUserDto,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
     ) {
          return this.usersService.create(dto, user, this.extractMeta(req));
     }

     @Patch(':id')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: 'Update a user (Admin only)',
          description:
               'Updates user fields. Self-protection prevents an admin from changing their own role or status.',
     })
     @ApiBody({ type: UpdateUserDto })
     @ApiResponse({ status: 200, description: 'User updated successfully' })
     @ApiResponse({ status: 403, description: 'Self-protection rule violated' })
     @ApiResponse({ status: 404, description: 'User not found' })
     update(
          @Param('id') id: string,
          @Body() dto: UpdateUserDto,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
     ) {
          return this.usersService.update(id, dto, user, this.extractMeta(req));
     }

     @Delete(':id')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: 'Delete a user (Admin only)',
          description:
               'Soft deletes a user. Self-protection prevents an admin from deleting their own account.',
     })
     @ApiResponse({ status: 200, description: 'User deleted successfully' })
     @ApiResponse({ status: 403, description: 'Cannot delete your own account' })
     @ApiResponse({ status: 404, description: 'User not found' })
     remove(
          @Param('id') id: string,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
     ) {
          return this.usersService.remove(id, user, this.extractMeta(req));
     }

     @Patch('profile/me')
     @ApiOperation({
          summary: 'Update my profile',
          description: 'Updates the authenticated user own profile fields.',
     })
     @ApiConsumes('multipart/form-data')
     @ApiBody({
          schema: {
               type: 'object',
               properties: {
                    data: {
                         type: 'string',
                         description: 'JSON-encoded UpdateProfileDto payload',
                    },
                    avatar: {
                         type: 'string',
                         format: 'binary',
                         description: 'Optional avatar image file',
                    },
               },
          },
     })
     @UseInterceptors(FileInterceptor('avatar'))
     @ApiResponse({ status: 200, description: 'Profile updated successfully' })
     updateProfile(
          @CurrentUser() user: AuthUser,
          @Body('data') data: string,
          @UploadedFile() file: Express.Multer.File,
          @Req() req: Request,
     ) {
          return this.usersService.updateProfile(user.id, data, file, this.extractMeta(req));
     }

     @Patch('profile/change-password')
     @ApiOperation({
          summary: 'Change my password',
          description: 'Changes the authenticated user own password. Requires current password.',
     })
     @ApiBody({ type: ChangePasswordDto })
     @ApiResponse({ status: 200, description: 'Password changed successfully' })
     @ApiResponse({ status: 401, description: 'Current password is incorrect' })
     changePassword(
          @CurrentUser() user: AuthUser,
          @Body() dto: ChangePasswordDto,
          @Req() req: Request,
     ) {
          return this.usersService.changePassword(user.id, dto, this.extractMeta(req));
     }

     @Patch(':id/role')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: "Update a user's role (Admin only)",
          description:
               "Changes a user's role. Self-protection prevents an admin from changing their own role.",
     })
     @ApiQuery({ name: 'role', required: true, enum: UserRole })
     @ApiResponse({ status: 200, description: 'Role updated successfully' })
     @ApiResponse({ status: 403, description: 'Cannot change your own role' })
     @ApiResponse({ status: 404, description: 'User not found' })
     updateRole(
          @Param('id') id: string,
          @Query('role') role: UserRole,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
     ) {
          return this.usersService.updateRole(id, role, user, this.extractMeta(req));
     }

     @Patch(':id/status')
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: "Update a user's status (Admin only)",
          description:
               "Changes a user's status (ACTIVE/INACTIVE/SUSPENDED). Self-protection prevents an admin from changing their own status.",
     })
     @ApiQuery({ name: 'status', required: true, enum: UserStatus })
     @ApiResponse({ status: 200, description: 'Status updated successfully' })
     @ApiResponse({ status: 403, description: 'Cannot change your own status' })
     @ApiResponse({ status: 404, description: 'User not found' })
     updateStatus(
          @Param('id') id: string,
          @Query('status') status: UserStatus,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
     ) {
          return this.usersService.updateStatus(id, status, user, this.extractMeta(req));
     }

     private extractMeta(req: Request) {
          return {
               ipAddress: req.ip || req.socket?.remoteAddress,
               device: req.get('user-agent'),
               userAgent: req.get('user-agent'),
          };
     }
}
