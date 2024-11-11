import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { ordersEntity } from './entities/order.entity';
import { usersEntity } from '../users/entities/user.entity';
import { productsEntity } from '../products/entities/product.entity';
import { ordersDetailEntity } from '../order-details/entities/order-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ordersEntity,
      usersEntity,
      productsEntity,
      ordersDetailEntity,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
