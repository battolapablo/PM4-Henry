import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import { usersEntity } from '../users/entities/user.entity';
import { ordersEntity } from './entities/order.entity';
import { productsEntity } from '../products/entities/product.entity';
import { ordersDetailEntity } from '../order-details/entities/order-detail.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(ordersEntity)
    private ordersRepository: Repository<ordersEntity>,

    @InjectRepository(usersEntity)
    private usersRepository: Repository<usersEntity>,

    @InjectRepository(productsEntity)
    private productsRepository: Repository<productsEntity>,

    @InjectRepository(ordersDetailEntity)
    private orderDetailsRepository: Repository<ordersDetailEntity>,
  ) {}

  async addOrder(
    userId: string,
    productsPreLoad: { id: string }[],
  ): Promise<ordersEntity> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const productIds = productsPreLoad.map((p) => p.id);
    if (!productIds) throw new NotFoundException('Product not found');

    const availableProducts = await this.productsRepository.find({
      where: { id: In(productIds), stock: MoreThan(0) },
    });
    if (availableProducts.length === 0)
      throw new BadRequestException('No valid products found');
    if (productIds.length !== availableProducts.length) {
      throw new NotFoundException('Product not found');
    }

    let totalAmount: number = 0;
    const updatedProducts = availableProducts.map((product) => {
      const price = parseFloat(product.price as any);
      if (isNaN(price) || price <= 0) {
        throw new BadRequestException(
          `Invalid price for product ID ${product.id}`,
        );
      }
      totalAmount += price;
      return {
        ...product,
        stock: product.stock - 1,
      };
    });

    const formattedAmount = parseFloat(totalAmount.toFixed(2));
    if (isNaN(formattedAmount) || formattedAmount < 0) {
      throw new BadRequestException('Total amount is invalid');
    }

    await Promise.all(
      updatedProducts.map((product) =>
        this.productsRepository
          .createQueryBuilder()
          .update(productsEntity)
          .set({ stock: product.stock })
          .where('id = :id', { id: product.id })
          .execute(),
      ),
    );

    const orderDetails = new ordersDetailEntity();
    orderDetails.products = updatedProducts;
    orderDetails.price = formattedAmount;
    await this.orderDetailsRepository.save(orderDetails);

    const order = new ordersEntity();
    const { password, confirmPassword, isAdmin, ...safeUser } = user;
    order.user = { ...safeUser } as usersEntity;
    order.orderDetails = orderDetails;
    return await this.ordersRepository.save(order);
  }

  async getOrder(orderId: string): Promise<ordersEntity> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['orderDetails', 'orderDetails.products'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
