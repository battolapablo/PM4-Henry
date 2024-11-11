import { productsEntity } from '../../products/entities/product.entity';

export class UploadImageResponseDto {
  message: string;
  url: string;
  mimeType: string;
  data: Buffer;
  product: productsEntity;
}
