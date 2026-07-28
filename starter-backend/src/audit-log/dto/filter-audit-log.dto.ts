import { ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterAuditLogDto extends PaginationDto {
     @ApiPropertyOptional({ enum: AuditAction, description: 'Filter by action' })
     @IsEnum(AuditAction)
     @IsOptional()
     action?: AuditAction;

     @ApiPropertyOptional({ description: 'Filter by user ID' })
     @IsUUID()
     @IsOptional()
     userId?: string;

     @ApiPropertyOptional({ description: 'Filter by entity name' })
     @IsString()
     @IsOptional()
     entity?: string;

     @ApiPropertyOptional({ description: 'Filter by entity ID' })
     @IsString()
     @IsOptional()
     entityId?: string;
}
