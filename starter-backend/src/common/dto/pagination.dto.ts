import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum SortOrder {
     ASC = 'asc',
     DESC = 'desc',
}

/**
 * Reusable Pagination DTO.
 * Every listing endpoint must support these query params.
 */
export class PaginationDto {
     @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
     @Type(() => Number)
     @IsInt()
     @Min(1)
     @IsOptional()
     page?: number = 1;

     @ApiPropertyOptional({
          description: 'Items per page',
          default: 10,
          minimum: 1,
          maximum: 100,
     })
     @Type(() => Number)
     @IsInt()
     @Min(1)
     @Max(100)
     @IsOptional()
     limit?: number = 10;

     @ApiPropertyOptional({ description: 'Search keyword' })
     @IsString()
     @IsOptional()
     search?: string;

     @ApiPropertyOptional({ description: 'Field to sort by' })
     @IsString()
     @IsOptional()
     sortBy?: string = 'createdAt';

     @ApiPropertyOptional({
          description: 'Sort order',
          enum: SortOrder,
          default: SortOrder.DESC,
     })
     @IsEnum(SortOrder)
     @IsOptional()
     sortOrder?: SortOrder = SortOrder.DESC;
}
