import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly ProductsRepository: ProductsRepository) {}
  create(createProductDto: CreateProductDto) {
    return this.ProductsRepository.createProduct(createProductDto);
  }
  async productsSeeding() {
    return await this.ProductsRepository.seedProducts();
  }

  async findAll(page: number, limit: number) {
    return await this.ProductsRepository.findAllProducts(page, limit);
  }

  async findOne(id: string) {
    return await this.ProductsRepository.getProductById(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this.ProductsRepository.updateProduct(id, updateProductDto);
  }

  async remove(id: string) {
    return await this.ProductsRepository.deleteProduct(id);
  }

}
