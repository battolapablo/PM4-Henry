import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtService } from '@nestjs/jwt';
import { FileService } from '../files/files.service';
import { productsEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;
  let fileService: FileService;

  const mockProduct: Partial<productsEntity> = {
    id: '1',
    name: 'Product 1',
    description: 'Product 1 description',
    price: 10,
    stock: 10,
    imgUrl: 'example.jpg',
  };

  beforeEach(async () => {
    const mockProductsService = {
      create: jest.fn().mockResolvedValue(mockProduct),
      findAll: jest.fn().mockResolvedValue([mockProduct]),
      findOne: jest.fn().mockResolvedValue(mockProduct),
      update: jest
        .fn()
        .mockResolvedValue({ ...mockProduct, name: 'Updated Product' }),
      remove: jest.fn().mockResolvedValue(mockProduct),
      productsSeeding: jest.fn().mockResolvedValue('Seeding successful'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  it('create () should create a product', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Product 1',
      description: 'Product 1 description',
      price: 10,
      stock: 10,
      imgUrl: 'example.jpg',
    };

    const result = await productsController.create(createProductDto);
    expect(result).toEqual(mockProduct);
    expect(productsService.create).toHaveBeenCalledWith(createProductDto);
  });

  it('findAll() should return an array of products', async () => {
    const result = await productsController.findAll(1, 10);
    expect(result).toEqual([mockProduct]);
    expect(productsService.findAll).toHaveBeenCalledWith(1, 10);
  });

  it('findOne() should return a single product by ID', async () => {
    const result = await productsController.findOne('1');
    expect(result).toEqual(mockProduct);
    expect(productsService.findOne).toHaveBeenCalledWith('1');
  });

  it('update() should update a product', async () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Product',
      description: 'Updated description',
      price: 12,
      stock: 20,
      imgUrl: 'updated.jpg',
    };

    const result = await productsController.update('1', updateProductDto);
    expect(result).toEqual({ ...mockProduct, name: 'Updated Product' });
    expect(productsService.update).toHaveBeenCalledWith('1', updateProductDto);
  });

  it('remove() should remove a product', async () => {
    const result = await productsController.remove('1');
    expect(result).toEqual(mockProduct);
    expect(productsService.remove).toHaveBeenCalledWith('1');
  });

  it('seeder() should seed products', async () => {
    const result = await productsController.seeder();
    expect(result).toEqual('Seeding successful');
    expect(productsService.productsSeeding).toHaveBeenCalled();
  });
});
