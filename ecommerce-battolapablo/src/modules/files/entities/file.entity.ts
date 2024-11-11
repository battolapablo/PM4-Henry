import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { productsEntity } from '../../products/entities/product.entity';

@Entity({ name: 'files' })
export class fileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bytea' })
  data: Buffer;

  @ManyToOne(() => productsEntity, (product) => product.files)
  @JoinTable()
  product: productsEntity;
}
