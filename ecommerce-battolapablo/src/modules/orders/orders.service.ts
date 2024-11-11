import { BadRequestException, Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { ordersEntity } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: OrdersRepository) {}

  async createOrder(
    userId: string,
    products: { id: string }[],
  ): Promise<ordersEntity> {
    if (!products || products.length === 0) {
      throw new BadRequestException('Product not found');
    }

    for (const product of products) {
      if (!product.id || typeof product.id !== 'string') {
        throw new BadRequestException('Invalid product ID');
      }
    }

    return await this.ordersRepository.addOrder(userId, products);
  }

  async getOrder(orderId: string): Promise<ordersEntity> {
    return await this.ordersRepository.getOrder(orderId);
  }
}
