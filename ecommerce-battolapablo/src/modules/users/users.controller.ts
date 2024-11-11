import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthHeaderGuard } from '../../Guards/authHeader.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../../Guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../utils/roles.enum';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthHeaderGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiResponse({
    status: 200,
    description: 'Users found successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: 'dfc9b7c9-b560-4fcc-9c3c-fa78a2753a70',
            name: 'string',
            email: 'string@hola.com',
            phone: 123123,
            country: 'string',
            address: 'string',
            city: 'string',
            isAdmin: false,
          },
          {
            id: 'f72c4451-23bc-4ae2-9c6b-b5b66babb581',
            name: 'asddasdasd',
            email: 'aa42433s@eample.com',
            phone: 13465890,
            country: 'argetina',
            address: '79 Elm St',
            city: 'crdoba',
            isAdmin: true,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Users not found',
    content: {
      'aplication/json': {
        example: {
          message: 'Users not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    content: {
      'aplication/json': {
        example: {
          message:
            'You do not have permission and are not allowed to access this route',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  @Get()
  @ApiOperation({ summary: 'Get All Users **' })
  async findAll() {
    const users = await this.usersService.findAll();
    if (!users) {
      throw new NotFoundException('Users not found');
    }
    return users;
  }

  @UseGuards(AuthHeaderGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @ApiResponse({
    status: 200,
    description: 'Get User By ID successfully',
    content: {
      'aplication/json': {
        example: {
          id: 'dc3e557b-d14d-4f91-a417-80058e1126ea',
          name: 'example',
          email: 'example@eample.com',
          phone: 351225588,
          country: 'Argetina',
          address: 'Suquia 200',
          city: 'Cordoba',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    content: {
      'aplication/json': {
        example: {
          message: 'User not found',
          error: 'Not Found',
          statusCode: 404,
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
  @Get(':id')
  @ApiOperation({ summary: 'Get User By ID **' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  @UseGuards(AuthHeaderGuard)
  @ApiBearerAuth()
  @ApiBody({
    description: 'Request body for updating a user',
    required: true,
    type: UpdateUserDto,
    examples: {
      example1: {
        summary: 'Update user example',
        value: {
          name: 'example 2',
          address: 'Suquia 200',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Update User successfully',
    content: {
      'aplication/json': {
        example: {
          id: '116e2daa-2d83-45f5-b308-c78047ec460e',
          name: 'example 2',
          email: 'aa42433s@eample.com',
          phone: 13465890,
          country: 'Argentina',
          address: 'Suquia 200',
          city: 'cordoba',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'User not found',
    content: {
      'aplication/json': {
        example: {
          message: 'User not found',
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
  @Put(':id')
  @ApiOperation({ summary: 'Update User by ID *' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User Not Found');
    }
    return updatedUser;
  }

  @UseGuards(AuthHeaderGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Delete User By ID successfully',
    content: {
      'aplication/json': {
        example: {
          message: 'User deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    content: {
      'aplication/json': {
        example: {
          message: 'User not found.',
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
  @Delete(':id')
  @ApiOperation({ summary: 'Delete User by ID *' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const deletedUser = await this.usersService.remove(id);
    if (!deletedUser) throw new NotFoundException('User no Found');
    return { message: 'User deleted successfully' };
  }
}
