import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryEntity } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([categoryEntity])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
