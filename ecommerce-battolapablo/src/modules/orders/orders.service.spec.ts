import { Test } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { ordersEntity } from './entities/order.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let mockOrdersRepository: Partial<OrdersRepository>;

  const mockOrder: Partial<ordersEntity> = {
    id: 'order-id',
    date: new Date(),
  };

  beforeEach(async () => {
    mockOrdersRepository = {
      addOrder: jest.fn().mockResolvedValue(mockOrder),
      getOrder: jest.fn().mockResolvedValue(mockOrder),
    };

    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  it('createOrder() should create an order and return it', async () => {
    const userId = 'user-id';
    const products = [{ id: 'product-id' }];
    const order = await ordersService.createOrder(userId, products);

    expect(order).toEqual(mockOrder);
    expect(mockOrdersRepository.addOrder).toHaveBeenCalledWith(
      userId,
      products,
    );
  });

  it('getOrder() should return an order by ID', async () => {
    const orderId = 'order-id';
    const order = await ordersService.getOrder(orderId);

    expect(order).toEqual(mockOrder);
    expect(mockOrdersRepository.getOrder).toHaveBeenCalledWith(orderId);
  });

  it('getOrder() should throw an error if order is not found', async () => {
    mockOrdersRepository.getOrder = jest.fn().mockImplementation(() => {
      throw new NotFoundException('Order not found');
    });

    const orderId = 'invalid-order-id';

    await expect(ordersService.getOrder(orderId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('createOrder() should throw a BadRequestException if products are invalid', async () => {
    const userId = 'user-id';
    const products: { id: string }[] = []; // Simulating invalid products

    await expect(ordersService.createOrder(userId, products)).rejects.toThrow(
      BadRequestException,
    );
  });
});
