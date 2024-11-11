import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { productsEntity } from '../../products/entities/product.entity';
import { ordersEntity } from '../../orders/entities/order.entity';

@Entity()
export class ordersDetailEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @OneToOne(() => ordersEntity, (ordersEntity) => ordersEntity.orderDetails)
  @JoinColumn()
  order: ordersEntity;

  @ManyToMany(() => productsEntity, (product) => product.ordersDetail)
  @JoinTable()
  products: productsEntity[];
}
