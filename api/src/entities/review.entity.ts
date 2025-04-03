import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '~/entities/user.entity';
import { ProductEntity } from '~/entities/product.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  user: UserEntity;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column({ type: 'text' })
  content: string;

  @Column()
  rating: number;

  @CreateDateColumn()
  createdAt: Date;
}
