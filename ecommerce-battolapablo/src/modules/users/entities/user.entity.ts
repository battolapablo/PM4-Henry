import { IsEmail, Length, IsInt } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ordersEntity } from '../../orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class usersEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier for the user',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  @Length(3, 50)
  @ApiProperty({
    description: 'User name',
    type: 'string',
    minLength: 3,
    maxLength: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
    length: 50,
  })
  @IsEmail()
  @ApiProperty({
    description: 'User email address',
    type: 'string',
    format: 'email',
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @ApiProperty({ description: 'User password', type: 'string' })
  password: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  @ApiProperty({
    description: 'Confirmation of the user password',
    type: 'string',
  })
  confirmPassword: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  @IsInt()
  @ApiProperty({
    description: 'User phone number',
    type: 'number',
    nullable: true,
  })
  phone: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  @ApiProperty({
    description: 'User country',
    type: 'string',
    maxLength: 50,
    nullable: true,
  })
  country: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @ApiProperty({
    description: 'User address',
    type: 'string',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  @ApiProperty({
    description: 'User city',
    type: 'string',
    maxLength: 50,
    nullable: true,
  })
  city: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: 'Indicates whether the user is an admin',
    type: 'boolean',
    default: false,
  })
  isAdmin: boolean;

  @OneToMany(() => ordersEntity, (order) => order.user)
  @ApiProperty({
    description: 'Orders associated with the user',
    type: () => [ordersEntity],
  })
  orders: ordersEntity[];
}
