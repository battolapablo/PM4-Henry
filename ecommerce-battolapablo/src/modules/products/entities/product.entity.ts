import { IsUrl, Length } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ordersDetailEntity } from '../../order-details/entities/order-detail.entity';
import { categoryEntity } from '../../categories/entities/category.entity';
import { fileEntity } from '../../files/entities/file.entity';

@Entity()
export class productsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  @Length(1, 50)
  name: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  stock: number;

  @Column({
    type: 'varchar',
    nullable: true,
    default:
      'https://img.freepik.com/vector-gratis/fondo-estudio-blanco-plataforma-visualizacion-podio_1017-37977.jpg',
  })
  @IsUrl()
  imgUrl: string;

  @ManyToOne(() => categoryEntity, (category) => category.products, {
    nullable: false,
  })
  @JoinColumn()
  category: categoryEntity;

  @ManyToMany(() => ordersDetailEntity, (orderDetail) => orderDetail.products)
  ordersDetail: ordersDetailEntity[];

  @OneToMany(() => fileEntity, (file) => file.product)
  @JoinTable()
  files: fileEntity[];
}
