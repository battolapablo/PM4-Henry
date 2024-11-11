import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Updated name of the product',
    type: 'string',
    minLength: 2,
    maxLength: 50,
    example: 'New Gaming Laptop',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated description of the product',
    type: 'string',
    maxLength: 500,
    example: 'Updated description for high-performance gaming laptop.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated price of the product',
    type: 'number',
    format: 'float',
    minimum: 0,
    example: 1399.99,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiPropertyOptional({
    description: 'Updated stock of the product',
    type: 'number',
    minimum: 0,
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  stock?: number;

  @ApiPropertyOptional({
    description: 'Updated URL to the product image',
    type: 'string',
    format: 'url',
    example: 'https://example.com/new-product-image.jpg',
  })
  @IsOptional()
  @IsUrl()
  imgUrl?: string;
}
