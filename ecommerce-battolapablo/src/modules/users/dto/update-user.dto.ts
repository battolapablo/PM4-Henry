import {
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
  Length,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @ApiPropertyOptional({
    description: 'User email address',
    type: 'string',
    format: 'email',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  @ApiPropertyOptional({
    description: 'User name',
    type: 'string',
    minLength: 2,
    maxLength: 50,
  })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  })
  @ApiPropertyOptional({
    description: 'User password',
    type: 'string',
    minLength: 8,
    maxLength: 20,
  })
  password?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User address', type: 'string' })
  address?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Phone must be a valid number' })
  @ApiPropertyOptional({ description: 'User phone number', type: 'number' })
  phone?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User country', type: 'string' })
  country?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'User city', type: 'string' })
  city?: string;
}
