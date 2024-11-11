import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { productsEntity } from '../../products/entities/product.entity';

@Entity()
export class categoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @OneToMany(() => productsEntity, (product) => product.category)
  products: productsEntity[];
}
