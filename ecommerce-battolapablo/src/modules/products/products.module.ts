import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { productsEntity } from './entities/product.entity';
import { categoryEntity } from '../categories/entities/category.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    CategoriesModule,
    TypeOrmModule.forFeature([productsEntity, categoryEntity]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
