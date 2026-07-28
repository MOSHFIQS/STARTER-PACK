import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import {
     IsEnum,
     IsNotEmpty,
     IsObject,
     IsOptional,
     IsString,
     MaxLength,
} from 'class-validator';

export class CreateNotificationDto {
     @ApiProperty({ description: 'User ID to send the notification to' })
     @IsString()
     @IsNotEmpty()
     userId: string;

     @ApiProperty({
          enum: NotificationType,
          default: NotificationType.INFO,
          description: 'Notification type',
     })
     @IsEnum(NotificationType)
     @IsOptional()
     type?: NotificationType;

     @ApiProperty({ description: 'Notification title' })
     @IsString()
     @IsNotEmpty()
     @MaxLength(255)
     title: string;

     @ApiProperty({ description: 'Notification message' })
     @IsString()
     @IsNotEmpty()
     @MaxLength(2000)
     message: string;

     @ApiPropertyOptional({
          description: 'Additional data (JSON object)',
          example: { inquiryId: 'uuid', status: 'pending' },
     })
     @IsOptional()
     @IsObject()
     data?: Record<string, any>;
}
