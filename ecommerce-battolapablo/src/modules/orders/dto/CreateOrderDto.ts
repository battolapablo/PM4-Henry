import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class ProductDto {
  @IsNotEmpty()
  @IsUUID("4")
  id: string;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    type: 'string',
    format: 'uuid',
  })
  @IsNotEmpty()
  @IsUUID('4')
  userId: string;
  @ApiProperty({
    description: 'List of products included in the order',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
    },
    minItems: 1,
  })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
