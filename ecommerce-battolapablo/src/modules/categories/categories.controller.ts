import { Controller, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@Controller('categories')
@ApiTags('Seeders')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}


  @ApiBearerAuth()
  @Post('seeder')
  @ApiOperation({ summary: 'Create Categories (Preload)' })
  async seeder() {
    try {
      return await this.categoriesService.seeder();
    } catch (error) {
      console.error(`Error seeding categories:`, error);
    }
  }
}
