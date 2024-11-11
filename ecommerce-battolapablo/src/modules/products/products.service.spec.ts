import { Test } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { productsEntity } from './entities/product.entity';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let mockProductsRepository: Partial<ProductsRepository>;

  const mockProduct: Omit<productsEntity, 'id' | 'category'> = {
    name: 'Iphone 15',
    description: 'The best smartphone in the world',
    price: 199.99,
    stock: 12,
    files: [],
    imgUrl: '',
    ordersDetail: [],
  };

  beforeEach(async () => {
    mockProductsRepository = {
      findAllProducts: jest.fn((page: number, limit: number) =>
        Promise.resolve([mockProduct] as productsEntity[]),
      ),
      getProductById: jest.fn((id: string) =>
        Promise.resolve({ ...mockProduct, id } as productsEntity),
      ),
      createProduct: jest.fn((createProductDto: CreateProductDto) =>
        Promise.resolve({
          ...createProductDto,
          id: '1234fs-234sd-24cs-fd-34sdfg',
        } as productsEntity),
      ),
      updateProduct: jest.fn((id: string, updateProductDto: UpdateProductDto) =>
        Promise.resolve({
          ...updateProductDto,
          id,
        } as productsEntity),
      ),
      deleteProduct: jest.fn((id: string) =>
        Promise.resolve({ id } as productsEntity),
      ),
      seedProducts: jest.fn(() => Promise.resolve()),
    };

    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: mockProductsRepository },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  it('create() should create a new product', async () => {
    const createProductDto: CreateProductDto = {
      name: 'New Product',
      description: 'Product description',
      price: 100,
      stock: 10,
      imgUrl: '',
    };

    const product = await productsService.create(createProductDto);
    expect(product).toBeDefined();
    expect(product.name).toEqual(createProductDto.name);
    expect(product.id).toBeDefined();
  });

  it('findAll() should return a list of products', async () => {
    const products = await productsService.findAll(1, 10);
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].name).toEqual(mockProduct.name);
  });

  it('findOne() should return a product by id', async () => {
    const product = await productsService.findOne('123');
    expect(product).toBeDefined();
    expect(product.id).toEqual('123');
  });

  it('update() should update a product by id', async () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Product',
      description: 'Updated description',
      price: 150,
      stock: 20,
    };

    const updatedProduct = await productsService.update(
      '123',
      updateProductDto,
    );
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct.name).toEqual(updateProductDto.name);
  });

  it('remove() should delete a product by id', async () => {
    const result = await productsService.remove('123');
    expect(result).toBeDefined();
    expect(result.id).toEqual('123');
  });

  it('productsSeeding() should seed products', async () => {
    await productsService.productsSeeding();
    expect(mockProductsRepository.seedProducts).toHaveBeenCalled();
  });
});
