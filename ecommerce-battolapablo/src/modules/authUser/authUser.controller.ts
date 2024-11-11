import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthUserService } from './authUser.service';
import { DateAdderInterceptor } from '../../interceptors/date-adder.interceptor';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/LoginUserDto';

@Controller('auth')
@ApiTags('Auth')
export class AuthUsersController {
  constructor(private readonly authUserService: AuthUserService) {}

  @UseInterceptors(DateAdderInterceptor)
  @ApiBody({
    description: 'Request body for creating a user',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Create user example',
        value: {
          email: 'example@example.com',
          name: 'example',
          password: '123456Aa!',
          confirmPassword: '123456Aa!',
          address: 'Suquia 200',
          phone: 3512322223,
          country: 'Argentina',
          city: 'Cordoba',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    content: {
      'aplication/json': {
        example: {
          name: 'example',
          email: 'example@eample.com',
          phone: 351225588,
          country: 'Argetina',
          address: 'Suquia 200',
          city: 'Cordoba',
          id: 'dc3e557b-d14d-4f91-a417-80058e1126ea',
          createdAt: '22/9/2024, 22:41:00',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email already exists',
    content: {
      'aplication/json': {
        example: {
          message: 'Email is already in use',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized access',
    content: {
      'aplication/json': {
        example: {
          message: 'Token not found',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Error creating User',
    content: {
      'aplication/json': {
        example: {
          message: 'Internal Server Error',
          error: 'Error creating User',
          statusCode: 500,
        },
      },
    },
  })
  @Post('signup')
  @ApiOperation({ summary: 'SignUp (Create New User)' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.authUserService.signUp(createUserDto);
    if (!user) {
      throw new BadRequestException('User creation failed');
    }
    return user;
  }

  @ApiBody({
    type: LoginUserDto,
    examples: {
      example1: {
        summary: 'Login user example',
        value: {
          email: 'example@example.com',
          password: '123456Aa!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User Logged in successfully',
    content: {
      'aplication/json': {
        example: {
          success: 'User logged in successfully',
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTZlMmRhYS0yZDgzLTQ1ZjUtYjMwOC1jNzgwNDdlYzQ2MGUiLCJpZCI6IjExNmUyZGFhLTJkODMtNDVmNS1iMzA4LWM3ODA0N2VjNDYwZSIsImVtYWlsIjoiYWE0MjQzM3NAZWFtcGxlLmNvbSIsInJvbGVzIjpbImFkbWluIl0sImlhdCI6MTcyNzA2MDAyNiwiZXhwIjoxNzI3MDYzNjI2fQ.pIreGWKvm9qsdSB2V3ScxHohoSZc97MJoSOymHWFjqc',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials',
    content: {
      'aplication/json': {
        example: {
          message: 'Invalid credentials',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @Post('signin')
  @ApiOperation({ summary: 'SignIn (Login)' })
  async signin(@Body() user: LoginUserDto) {
    return this.authUserService.signIn(user.email, user.password);
  }
}
