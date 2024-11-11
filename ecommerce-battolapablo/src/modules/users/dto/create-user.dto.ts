import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User email address',
    type: 'string',
    format: 'email',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(80)
  @ApiProperty({
    description: 'User name',
    type: 'string',
    minLength: 3,
    maxLength: 80,
  })
  name: string;

  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
  })
  @ApiProperty({ description: 'User password', type: 'string', minLength: 3 })
  password: string;

  @MinLength(3)
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/)
  @ApiProperty({
    description: 'Confirmation of user password',
    type: 'string',
    minLength: 3,
  })
  confirmPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  @ApiProperty({
    description: 'User address',
    type: 'string',
    minLength: 3,
    maxLength: 80,
  })
  address: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'User phone number', type: 'number' })
  phone: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @ApiProperty({
    description: 'User country',
    type: 'string',
    minLength: 5,
    maxLength: 30,
  })
  country: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @ApiProperty({
    description: 'User city',
    type: 'string',
    minLength: 5,
    maxLength: 30,
  })
  city: string;

}
