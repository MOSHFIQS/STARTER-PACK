import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FilterUserDto extends PaginationDto {
     @ApiPropertyOptional({ enum: UserRole, description: 'Filter by role' })
     @IsEnum(UserRole)
     @IsOptional()
     role?: UserRole;

     @ApiPropertyOptional({ enum: UserStatus, description: 'Filter by status' })
     @IsEnum(UserStatus)
     @IsOptional()
     status?: UserStatus;

     @ApiPropertyOptional({ description: 'Filter by city' })
     @IsString()
     @IsOptional()
     city?: string;

     @ApiPropertyOptional({ description: 'Filter by country' })
     @IsString()
     @IsOptional()
     country?: string;
}
