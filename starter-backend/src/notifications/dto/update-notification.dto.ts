import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
     @ApiPropertyOptional({ description: 'Mark notification as read/unread' })
     @IsOptional()
     @IsBoolean()
     isRead?: boolean;
}
