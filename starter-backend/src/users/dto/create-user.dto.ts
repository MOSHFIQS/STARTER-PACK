import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import {
     IsEmail,
     IsEnum,
     IsNotEmpty,
     IsOptional,
     IsString,
     Length,
     Matches,
} from 'class-validator';

export class CreateUserDto {
     @ApiProperty({ example: 'john@example.com' })
     @IsEmail({}, { message: 'Please enter a valid email address.' })
     @IsNotEmpty({ message: 'Email is required.' })
     email: string;

     @ApiProperty({ example: 'John' })
     @IsString({ message: 'First name must be text.' })
     @IsNotEmpty({ message: 'First name is required.' })
     @Length(2, 50, { message: 'First name must be between 2 and 50 characters.' })
     firstName: string;

     @ApiProperty({ example: 'Doe' })
     @IsString({ message: 'Last name must be text.' })
     @IsNotEmpty({ message: 'Last name is required.' })
     @Length(2, 50, { message: 'Last name must be between 2 and 50 characters.' })
     lastName: string;

     @ApiPropertyOptional({ example: '+8801712345678' })
     @IsString({ message: 'Phone must be text.' })
     @Matches(/^\+?[0-9]{10,15}$/, { message: 'Phone must be 10-15 digits, optionally starting with +.' })
     @IsOptional()
     phone?: string;

     @ApiProperty({ example: 'StrongPass123!' })
     @IsString({ message: 'Password must be text.' })
     @IsNotEmpty({ message: 'Password is required.' })
     password: string;

     @ApiPropertyOptional({ enum: UserRole, default: UserRole.CUSTOMER })
     @IsEnum(UserRole, { message: 'Role must be a valid user role.' })
     @IsOptional()
     role?: UserRole;

     @ApiPropertyOptional({ enum: UserStatus, default: UserStatus.ACTIVE })
     @IsEnum(UserStatus, { message: 'Status must be a valid user status.' })
     @IsOptional()
     status?: UserStatus;
}
