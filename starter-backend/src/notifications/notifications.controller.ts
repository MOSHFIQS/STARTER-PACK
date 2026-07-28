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
     UseGuards,
} from '@nestjs/common';
import {
     ApiBearerAuth,
     ApiBody,
     ApiOperation,
     ApiQuery,
     ApiResponse,
     ApiTags,
} from '@nestjs/swagger';
import { NotificationType, UserRole } from '@prisma/client';
import { Request } from 'express';
import { AuthUser, CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { FilterNotificationDto } from './dto/filter-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
     constructor(private readonly notificationsService: NotificationsService) { }

     @Get()
     @ApiOperation({
          summary: 'List notifications',
          description:
               'Retrieve a paginated list of notifications. Customers only see their own notifications. Admins can filter by userId.',
     })
     @ApiQuery({ name: 'page', required: false, type: Number })
     @ApiQuery({ name: 'limit', required: false, type: Number })
     @ApiQuery({ name: 'search', required: false, type: String })
     @ApiQuery({ name: 'userId', required: false, type: String, description: 'Admin only' })
     @ApiQuery({ name: 'type', required: false, enum: NotificationType })
     @ApiQuery({ name: 'isRead', required: false, type: Boolean })
     @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
     findAll(@Query() dto: FilterNotificationDto, @CurrentUser() user: AuthUser) {
          return this.notificationsService.findAll(dto, user);
     }

     @Get('unread/count')
     @ApiOperation({ summary: 'Get unread notification count' })
     @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
     getUnreadCount(@CurrentUser() user: AuthUser) {
          return this.notificationsService.getUnreadCount(user.id);
     }

     @Get(':id')
     @ApiOperation({ summary: 'Get a notification by ID' })
     @ApiResponse({ status: 200, description: 'Notification retrieved successfully' })
     @ApiResponse({ status: 404, description: 'Notification not found' })
     findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
          return this.notificationsService.findOne(id, user);
     }

     @Post()
     @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
     @ApiOperation({
          summary: 'Create a notification (Admin only)',
          description: 'Sends a notification to a specific user.',
     })
     @ApiBody({ type: CreateNotificationDto })
     @ApiResponse({ status: 201, description: 'Notification created successfully' })
     @ApiResponse({ status: 404, description: 'User not found' })
     create(
          @Body() dto: CreateNotificationDto,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
     ) {
          return this.notificationsService.create(dto, user, this.extractMeta(req));
     }

     @Patch(':id')
     @ApiOperation({
          summary: 'Update a notification',
          description: 'Mark a notification as read or unread. Customers can only update their own.',
     })
     @ApiBody({ type: UpdateNotificationDto })
     @ApiResponse({ status: 200, description: 'Notification updated successfully' })
     @ApiResponse({ status: 403, description: 'Cannot update another user\'s notification' })
     @ApiResponse({ status: 404, description: 'Notification not found' })
     update(
          @Param('id') id: string,
          @Body() dto: UpdateNotificationDto,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
     ) {
          return this.notificationsService.update(id, dto, user, this.extractMeta(req));
     }

     @Patch(':id/read')
     @ApiOperation({ summary: 'Mark a notification as read' })
     @ApiResponse({ status: 200, description: 'Notification marked as read' })
     @ApiResponse({ status: 404, description: 'Notification not found' })
     markAsRead(
          @Param('id') id: string,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
     ) {
          return this.notificationsService.markAsRead(id, user, this.extractMeta(req));
     }

     @Patch('read/all')
     @ApiOperation({ summary: 'Mark all notifications as read' })
     @ApiResponse({ status: 200, description: 'All notifications marked as read' })
     markAllAsRead(@CurrentUser() user: AuthUser, @Req() req: Request) {
          return this.notificationsService.markAllAsRead(user, this.extractMeta(req));
     }

     @Delete(':id')
     @ApiOperation({
          summary: 'Delete a notification',
          description: 'Permanently deletes a notification. Customers can only delete their own.',
     })
     @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
     @ApiResponse({ status: 403, description: 'Cannot delete another user\'s notification' })
     @ApiResponse({ status: 404, description: 'Notification not found' })
     remove(
          @Param('id') id: string,
          @CurrentUser() user: AuthUser,
          @Req() req: Request,
     ) {
          return this.notificationsService.remove(id, user, this.extractMeta(req));
     }

     private extractMeta(req: Request) {
          return {
               ipAddress: req.ip || req.socket?.remoteAddress,
               device: req.get('user-agent'),
               userAgent: req.get('user-agent'),
          };
     }
}
