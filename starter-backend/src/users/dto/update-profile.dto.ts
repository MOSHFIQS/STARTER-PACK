import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
     IsDateString,
     IsOptional,
     IsString,
     Length,
     Matches,
} from 'class-validator';

export class UpdateProfileDto {
     @ApiPropertyOptional({ example: 'John' })
     @IsString({ message: 'First name must be text.' })
     @Length(2, 50, { message: 'First name must be between 2 and 50 characters.' })
     @IsOptional()
     firstName?: string;

     @ApiPropertyOptional({ example: 'Doe' })
     @IsString({ message: 'Last name must be text.' })
     @Length(2, 50, { message: 'Last name must be between 2 and 50 characters.' })
     @IsOptional()
     lastName?: string;

     @ApiPropertyOptional({ example: '+8801712345678' })
     @IsString({ message: 'Phone must be text.' })
     @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone must be 10-15 digits, optionally starting with +.' })
     @IsOptional()
     phone?: string;

     @ApiPropertyOptional({ description: 'Bio' })
     @IsString({ message: 'Bio must be text.' })
     @Length(0, 500, { message: 'Bio cannot exceed 500 characters.' })
     @IsOptional()
     bio?: string;

     @ApiPropertyOptional({ description: 'Address' })
     @IsString({ message: 'Address must be text.' })
     @IsOptional()
     address?: string;

     @ApiPropertyOptional({ description: 'City' })
     @IsString({ message: 'City must be text.' })
     @IsOptional()
     city?: string;

     @ApiPropertyOptional({ description: 'Country' })
     @IsString({ message: 'Country must be text.' })
     @IsOptional()
     country?: string;

     @ApiPropertyOptional({ description: 'Postal code' })
     @IsString({ message: 'Postal code must be text.' })
     @IsOptional()
     postalCode?: string;

     @ApiPropertyOptional({ description: 'Gender' })
     @IsString({ message: 'Gender must be text.' })
     @IsOptional()
     gender?: string;

     @ApiPropertyOptional({ description: 'Date of birth (ISO date)' })
     @IsDateString({}, { message: 'Date of birth must be a valid ISO date.' })
     @IsOptional()
     dateOfBirth?: string;

     @ApiPropertyOptional({ description: 'Avatar Cloudinary URL' })
     @IsString({ message: 'Avatar URL must be text.' })
     @IsOptional()
     avatarUrl?: string;
}

export class ChangePasswordDto {
     @ApiProperty({ example: 'OldPass123!', description: 'Current password' })
     @IsString({ message: 'Current password is required and must be text.' })
     currentPassword: string;

     @ApiProperty({ example: 'NewPass123!', description: 'New password' })
     @IsString({ message: 'New password is required and must be text.' })
     newPassword: string;
}
