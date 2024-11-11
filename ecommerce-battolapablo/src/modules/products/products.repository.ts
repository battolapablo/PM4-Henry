import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { productsEntity } from './entities/product.entity';
import { categoryEntity } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(productsEntity)
    private productsRepository: Repository<productsEntity>,

    @InjectRepository(categoryEntity)
    private categoriesRepository: Repository<categoryEntity>,

    private datasource: DataSource,
  ) {}

  private productsPreLoad = [
    {
      name: 'Iphone 15',
      description: 'The best smartphone in the world',
      price: 199.99,
      stock: 12,
      category: 'smartphone',
    },
    {
      name: 'Samsung Galaxy S23',
      description: 'The best smartphone in the world',
      price: 150.0,
      stock: 12,
      category: 'smartphone',
    },
    {
      name: 'Motorola Edge 40',
      description: 'The best smartphone in the world',
      price: 179.89,
      stock: 12,
      category: 'smartphone',
    },
    {
      name: 'Samsung Odyssey G9',
      description: 'The best monitor in the world',
      price: 299.99,
      stock: 12,
      category: 'monitor',
    },
    {
      name: 'LG UltraGear',
      description: 'The best monitor in the world',
      price: 199.99,
      stock: 12,
      category: 'monitor',
    },
    {
      name: 'Acer Predator',
      description: 'The best monitor in the world',
      price: 150.0,
      stock: 12,
      category: 'monitor',
    },
    {
      name: 'Razer BlackWidow V3',
      description: 'The best keyboard in the world',
      price: 99.99,
      stock: 12,
      category: 'keyboard',
    },
    {
      name: 'Corsair K70',
      description: 'The best keyboard in the world',
      price: 79.99,
      stock: 12,
      category: 'keyboard',
    },
    {
      name: 'Logitech G Pro',
      description: 'The best keyboard in the world',
      price: 59.99,
      stock: 12,
      category: 'keyboard',
    },
    {
      name: 'Razer Viper',
      description: 'The best mouse in the world',
      price: 49.99,
      stock: 12,
      category: 'mouse',
    },
    {
      name: 'Logitech G502 Pro',
      description: 'The best mouse in the world',
      price: 39.99,
      stock: 12,
      category: 'mouse',
    },
    {
      name: 'SteelSeries Rival 3',
      description: 'The best mouse in the world',
      price: 29.99,
      stock: 12,
      category: 'mouse',
    },
  ];

  async findAllProducts(
    page: number = 1,
    limit: number = 5,
  ): Promise<productsEntity[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const newProduct = await this.productsRepository.find({
      where: {
        stock: MoreThan(0),
      },
      relations: ['files'],
    });
    if (!newProduct) {
      throw new NotFoundException('No products found.');
    }
    const paginatedProducts = await newProduct.slice(startIndex, endIndex);
    if (!paginatedProducts.length)
      throw new NotFoundException('No paginated products found.');
    return paginatedProducts;
  }

  async getProductById(id: string): Promise<productsEntity> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['files'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<productsEntity> {
    const { categoryId, ...productData } = createProductDto;

    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    try {
      const newProduct = this.productsRepository.create({
        ...productData,
        category,
      });

      return await this.productsRepository.save(newProduct);
    } catch (error) {
      throw new HttpException(
        'Error creating product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async seedProducts() {
    const queryRunner = this.datasource.createQueryRunner();

    const promises = this.productsPreLoad.map(async (product) => {
      const productValidate = await this.productsRepository.findOneBy({
        name: product.name,
      });
      if (!productValidate) {
        const categoryObject = await this.categoriesRepository.findOneBy({
          name: product.category,
        });
        const { category, ...rest } = product;

        const newProduct = await this.productsRepository.create({
          ...rest,
          category: categoryObject as categoryEntity,
        });
        await queryRunner.manager.save(newProduct);
      }
    });
    queryRunner.connect();
    queryRunner.startTransaction();
    try {
      await Promise.all(promises);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      console.log('preload of Products finally');
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<productsEntity> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['files'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productsRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
}
