import { IsOptional, IsDecimal, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { productsEntity } from '../../products/entities/product.entity';

export class UpdateOrderDetailDto {
  @ApiProperty({
    description: 'Precio del detalle de la orden (opcional)',
    type: 'number',
    example: 19.99,
    required: false,
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  price?: number;

  @ApiProperty({
    description: 'ID de la orden a la que se relaciona este detalle',
    type: 'string',
    example: 'b1d1c3f4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiProperty({
    description: 'Lista de productos asociados a este detalle (opcional)',
    type: [productsEntity],
    isArray: true,
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => productsEntity)
  products?: productsEntity[];
}
