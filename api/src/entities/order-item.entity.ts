import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { OrderEntity } from '~/entities/order.entity';
import { ProductEntity } from '~/entities/product.entity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  order: OrderEntity;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
