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

  @Column({ default: 'pending' }) // Các trạng thái: pending, processing, completed, cancelled
  status: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];
}
