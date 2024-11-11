import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { usersEntity } from '../../users/entities/user.entity';
import { ordersDetailEntity } from '../../order-details/entities/order-detail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ordersEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier for the order',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'Date when the order was created',
    type: 'string',
    format: 'date-time',
  })
  date: Date;

  @ManyToOne(() => usersEntity, (user) => user.orders)
  user: usersEntity;

  @OneToOne(
    () => ordersDetailEntity,
    (ordersDetailEntity) => ordersDetailEntity.order,
  )
  orderDetails: ordersDetailEntity;
}
