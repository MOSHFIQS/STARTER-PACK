import { ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterNotificationDto extends PaginationDto {
     @ApiPropertyOptional({ description: 'Filter by user' })
     @IsOptional()
     @IsString()
     userId?: string;

     @ApiPropertyOptional({ enum: NotificationType, description: 'Filter by type' })
     @IsOptional()
     @IsEnum(NotificationType)
     type?: NotificationType;

     @ApiPropertyOptional({ description: 'Filter by read status' })
     @IsOptional()
     @IsBoolean()
     isRead?: boolean;
}
