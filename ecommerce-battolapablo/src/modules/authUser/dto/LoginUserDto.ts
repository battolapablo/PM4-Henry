import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class LoginUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 50)
  @MinLength(3)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password too weak. It must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongP@ss123',
    minLength: 8,
    maxLength: 15,
  })
  password: string;
}
