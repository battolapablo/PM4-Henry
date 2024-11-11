import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  seeder() {
    this.categoryRepository.categoriesArray.forEach(async (category) => {
      try {
        await this.categoryRepository.addCategories(category);
      } catch (err) {
        console.error(`Error adding category ${category}:`, err);
      }
    });
    console.log(`Added category`);
  }
}
