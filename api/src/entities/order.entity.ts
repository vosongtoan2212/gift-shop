import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from '~/entities/user.entity';
import { OrderItemEntity } from '~/entities/order-item.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @Column()
  totalAmount: number;

  @Column({ default: 'pending' }) // Các trạng thái: pending, completed, cancelled
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];
}
