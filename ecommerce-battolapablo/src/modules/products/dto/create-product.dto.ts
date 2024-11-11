import {
  IsString,
  IsNumber,
  IsPositive,
  Min,
  IsUrl,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Unique identifier for the product category',
    type: 'string',
    format: 'uuid',
    example: 'a123b456-c789-012d-345e-678f90123g45',
  })
  @IsString()
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'Name of the product',
    type: 'string',
    minLength: 2,
    maxLength: 50,
    example: 'Gaming Laptop',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the product',
    type: 'string',
    maxLength: 500,
    example: 'High-performance laptop suitable for gaming and heavy tasks.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    type: 'number',
    format: 'float',
    minimum: 0,
    example: 1299.99,
  })
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({
    description: 'Available stock of the product',
    type: 'number',
    minimum: 0,
    example: 150,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  stock: number;

  @ApiProperty({
    description: 'URL to the product image',
    type: 'string',
    format: 'url',
    example: 'https://example.com/product-image.jpg',
  })
  @IsUrl()
  imgUrl: string;
}
