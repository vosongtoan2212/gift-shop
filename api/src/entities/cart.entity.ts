import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { UserEntity } from '~/entities/user.entity';
import { ProductEntity } from '~/entities/product.entity';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.carts) // Một người dùng có thể có nhiều giỏ hàng
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.carts) // Một sản phẩm có thể xuất hiện trong nhiều giỏ hàng
  product: ProductEntity;

  @Column()
  quantity: number;
}
