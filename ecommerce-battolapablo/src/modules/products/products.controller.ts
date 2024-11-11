import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthHeaderGuard } from '../../Guards/authHeader.guard';
import { RolesGuard } from '../../Guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../utils/roles.enum';
import {
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthHeaderGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @Post('createProduct')
  @ApiBody({
    description: 'Request body for creating a product',
    required: true,
    type: CreateProductDto,
    examples: {
      example1: {
        summary: 'Create Product example',
        value: {
          categoryId: '3279e42e-9b05-46ff-8b9f-689cb0031788',
          name: 'Mechanical Keyboard',
          description: 'RGB Mechanical Gaming Keyboard with 104 keys',
          price: 150.99,
          stock: 25,
          imgUrl: 'https://example.com/products/mechanical-keyboard.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    content: {
      'aplication/json': {
        example: {
          name: 'Mechanical Keyboard',
          description: 'RGB Mechanical Gaming Keyboard with 104 keys',
          price: 150.99,
          stock: 25,
          imgUrl: 'https://example.com/products/mechanical-keyboard.jpg',
          category: {
            id: '3279e42e-9b05-46ff-8b9f-689cb0031788',
            name: 'keyboard',
          },
          id: 'e66840dc-b238-470a-87ea-70683ef30186',
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
    description: 'Error creating Product',
    content: {
      'aplication/json': {
        example: {
          message: 'Internal Server Error',
          error: 'Error creating product',
          statusCode: 500,
        },
      },
    },
  })
  @ApiTags('Products')
  @ApiOperation({ summary: 'Create Product **' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiBearerAuth()
  @Post('seeder')
  @ApiTags('Seeders')
  @ApiOperation({ summary: 'Product Seeder (Preload)' })
  async seeder() {
    return await this.productsService.productsSeeding();
  }

  @ApiResponse({
    status: 200,
    description: 'Get All Products successfully',
    content: {
      'aplication/json': {
        example: [
          {
            id: '5ebcb750-a7a1-48dd-9ecd-c365b22e9dcf',
            name: 'LG UltraGear',
            description: 'The best monitor in the world',
            price: '199.99',
            stock: 12,
            imgUrl:
              'https://img.freepik.com/vector-gratis/fondo-estudio-blanco-plataforma-visualizacion-podio_1017-37977.jpg',
            files: [],
          },
          {
            id: 'f97872fd-26ce-4f9b-995b-7ef702abdd98',
            name: 'Product 1',
            description: 'Product 1 Description',
            price: '100.00',
            stock: 100,
            imgUrl: 'http://example.com/product1.jpg',
            files: [],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Products not found',
    content: {
      'aplication/json': {
        example: {
          message: 'No paginated products found.',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    },
  })
  @Get(':page/:limit')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get PAGINATED Products by Page/Limit' })
  async findAll(@Param('page') page: number, @Param('limit') limit: number) {
    return await this.productsService.findAll(page, limit);
  }

  @UseGuards(AuthHeaderGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @Put(':id')
  @ApiBody({
    description: 'Request body for updating a product',
    required: true,
    type: UpdateProductDto,
    examples: {
      example1: {
        summary: 'Update user example',
        value: {
          name: 'Motorola Edge 50',
          price: 2999.99,
          stock: 8,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Update product successfully',
    content: {
      'aplication/json': {
        example: {
          id: '94e6d3a9-c233-4fa7-85a2-109acd189a81',
          name: 'Motorola Edge 50',
          description: 'The best smartphone in the world',
          price: 2999.99,
          stock: 4,
          imgUrl:
            'https://img.freepik.com/vector-gratis/fondo-estudio-blanco-plataforma-visualizacion-podio_1017-37977.jpg',
          files: [],
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
  @ApiTags('Products')
  @ApiOperation({ summary: 'Update Product by ID **' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(id, updateProductDto);
  }
  
  @ApiResponse({
    status: 200,
    description: 'Get Product By ID successfully',
    content: {
      'aplication/json': {
        example: {
          id: '213bf418-1b2b-4266-a3ba-2ef7c9787419',
          name: 'Razer BlackWidow V3',
          description: 'The best keyboard in the world',
          price: '99.99',
          stock: 12,
          imgUrl:
            'https://img.freepik.com/vector-gratis/fondo-estudio-blanco-plataforma-visualizacion-podio_1017-37977.jpg',
          files: [],
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
  @Get(':id')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Get Product by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.findOne(id);
  }

  @UseGuards(AuthHeaderGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Delete Product By ID successfully',
    content: {
      'aplication/json': {
        example: {
          message: 'Product deleted successfully',
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
  @Delete(':id')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Delete Product By ID **' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.productsService.remove(id);
  }
}
