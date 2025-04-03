import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { UserEntity } from '~/entities/user.entity';
import { ProductEntity } from '~/entities/product.entity';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column()
  quantity: number;
}
