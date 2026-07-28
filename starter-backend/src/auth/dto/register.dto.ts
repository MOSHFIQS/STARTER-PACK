import { ApiProperty } from '@nestjs/swagger';
import {
     IsEmail,
     IsNotEmpty,
     IsOptional,
     IsString,
     Length,
     Matches,
} from 'class-validator';

export class RegisterDto {
     @ApiProperty({
          example: 'john@example.com',
          description: 'User email address',
     })
     @IsEmail()
     @IsNotEmpty()
     email: string;

     @ApiProperty({
          example: 'John',
          description: 'First name',
          minLength: 2,
          maxLength: 50,
     })
     @IsString()
     @IsNotEmpty()
     @Length(2, 50)
     firstName: string;

     @ApiProperty({
          example: 'Doe',
          description: 'Last name',
          minLength: 2,
          maxLength: 50,
     })
     @IsString()
     @IsNotEmpty()
     @Length(2, 50)
     lastName: string;

     @ApiProperty({
          example: '+8801712345678',
          description: 'Phone number (optional)',
          required: false,
     })
     @IsOptional()
     @IsString()
     @Matches(/^\+?[0-9]{10,15}$/, {
          message: 'Invalid phone number format',
     })
     phone?: string;

     @ApiProperty({
          example: 'password123',
          description: 'User password',
     })
     @IsString()
     @IsNotEmpty()
     password: string;
}