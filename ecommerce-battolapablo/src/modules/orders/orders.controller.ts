import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/CreateOrderDto';
import { AuthHeaderGuard } from '../../Guards/authHeader.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('orders')
@ApiTags('Orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AuthHeaderGuard)
  @ApiBearerAuth()
  @ApiBody({
    description: 'Request body for creating a product',
    required: true,
    type: CreateOrderDto,
    examples: {
      example1: {
        summary: 'Create Product example',
        value: {
          userId: 'dc3e557b-d14d-4f91-a417-80058e1126ea',
          products: [
            { id: '19e3bc72-4fec-4ba1-83ac-cfddb6bbe365' },
            { id: 'c2f879fb-f050-44af-90ff-981f3bc6185d' },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    content: {
      'aplication/json': {
        example: {
          user: {
            id: 'dc3e557b-d14d-4f91-a417-80058e1126ea',
            name: 'example',
            email: 'example@eample.com',
            phone: 351225588,
            country: 'Argetina',
            address: 'Suquia 200',
            city: 'Cordoba',
          },
          orderDetails: {
            products: [
              {
                id: '19e3bc72-4fec-4ba1-83ac-cfddb6bbe365',
                name: 'example 2',
                description:
                  'A high-end gaming laptop with a powerful GPU and high refresh rate display.',
                price: '1499.99',
                stock: 2,
                imgUrl: 'https://example.com/images/gaming-laptop.jpg',
              },
              {
                id: 'c2f879fb-f050-44af-90ff-981f3bc6185d',
                name: 'example 3',
                description:
                  'A high-end gaming laptop with a powerful GPU and high refresh rate display.',
                price: '1499.99',
                stock: 121,
                imgUrl: 'https://example.com/images/gaming-laptop',
              },
            ],
            price: 2999.98,
            id: '37f7892b-0534-4534-bd86-eee5f45ad79c',
          },
          id: '1ef7a228-4706-421d-8c99-8dc44c0b6104',
          date: '2024-09-23T04:00:33.274Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    content: {
      'aplication/json': {
        example: {
          message: 'Product not found',
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
  @Post()
  @ApiOperation({ summary: 'Create Order *' })
  async createOrder(
    @Body()
    createOrderDto: CreateOrderDto,
  ) {
    const { userId, products } = createOrderDto;

    if (!userId || !/^[0-9a-fA-F-]{36}$/.test(userId)) {
      throw new BadRequestException('Invalid user');
    }

    if (!products || products.length === 0) {
      throw new BadRequestException('Product not found');
    }

    const productIds = products.map((product) => product.id);

    const invalidProductIds = productIds.filter(
      (id) => !id || !/^[0-9a-fA-F-]{36}$/.test(id),
    );

    if (invalidProductIds.length > 0) {
      throw new BadRequestException(`Products ID is invalid`);
    }

    return await this.ordersService.createOrder(userId, products);
  }

  @UseGuards(AuthHeaderGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Order get by ID successfully',
    content: {
      'aplication/json': {
        example: {
          id: '1ef7a228-4706-421d-8c99-8dc44c0b6104',
          date: '2024-09-23T04:00:33.274Z',
          orderDetails: {
            id: '37f7892b-0534-4534-bd86-eee5f45ad79c',
            price: '2999.98',
            products: [
              {
                id: '19e3bc72-4fec-4ba1-83ac-cfddb6bbe365',
                name: 'asdasdasdasdasd',
                description:
                  'A high-end gaming laptop with a powerful GPU and high refresh rate display.',
                price: '1499.99',
                stock: 1,
                imgUrl: 'https://example.com/images/gaming-laptop.jpg',
              },
              {
                id: 'c2f879fb-f050-44af-90ff-981f3bc6185d',
                name: 'asdasdasdasdasd',
                description:
                  'A high-end gaming laptop with a powerful GPU and high refresh rate display.',
                price: '1499.99',
                stock: 120,
                imgUrl: 'https://example.com/images/gaming-laptop',
              },
            ],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    content: {
      'aplication/json': {
        example: {
          message: 'Order not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @Get(':id')
  @ApiOperation({ summary: 'Get Order By ID *' })
  async getOrder(@Param('id', ParseUUIDPipe) orderId: string) {
    return await this.ordersService.getOrder(orderId);
  }
}
