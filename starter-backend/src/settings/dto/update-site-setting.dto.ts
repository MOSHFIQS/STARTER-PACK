import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSiteSettingDto {
     @ApiPropertyOptional({ example: 'PropertyChai', description: 'Site name' })
     @IsOptional()
     @IsString()
     @MaxLength(100)
     siteName?: string;

     @ApiPropertyOptional({ example: 'Find Your Dream Property', description: 'Site tagline' })
     @IsOptional()
     @IsString()
     @MaxLength(255)
     tagline?: string;

     @ApiPropertyOptional({ description: 'Logo image URL' })
     @IsOptional()
     @IsString()
     logoUrl?: string;

     @ApiPropertyOptional({ example: '+8801700000000', description: 'Contact phone' })
     @IsOptional()
     @IsString()
     @MaxLength(30)
     phone?: string;

     @ApiPropertyOptional({ example: 'info@propertychai.com', description: 'Contact email' })
     @IsOptional()
     @IsString()
     @MaxLength(100)
     email?: string;

     @ApiPropertyOptional({ example: 'Dhaka, Bangladesh', description: 'Office address' })
     @IsOptional()
     @IsString()
     @MaxLength(255)
     address?: string;

     @ApiPropertyOptional({ description: 'Facebook page URL' })
     @IsOptional()
     @IsString()
     facebookUrl?: string;

     @ApiPropertyOptional({ description: 'Twitter profile URL' })
     @IsOptional()
     @IsString()
     twitterUrl?: string;

     @ApiPropertyOptional({ description: 'Instagram profile URL' })
     @IsOptional()
     @IsString()
     instagramUrl?: string;

     @ApiPropertyOptional({ description: 'LinkedIn profile URL' })
     @IsOptional()
     @IsString()
     linkedinUrl?: string;

     @ApiPropertyOptional({ example: '#10B981', description: 'Primary brand color' })
     @IsOptional()
     @IsString()
     primaryColor?: string;
}
