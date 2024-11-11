import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { categoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(categoryEntity)
    private categoriesRepository: Repository<categoryEntity>,
  ) {}

  public categoriesArray = ['smartphone', 'monitor', 'keyboard', 'mouse'];

  async getCategories(): Promise<string[]> {
    return await this.categoriesArray;
  }

  async addCategories(category: string) {
    try {
      const categoryVerifier = await this.categoriesRepository.findOneBy({
        name: category,
      });
      if (!categoryVerifier) {
        const newCategory = this.categoriesRepository.create({
          name: category,
        });
        await this.categoriesRepository.save(newCategory);
      }
    } catch (error) {
      console.error(`Error adding category ${category}:`, error);
    }
  }
}
