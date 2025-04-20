import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { CartEntity } from '~/entities/cart.entity';
import { OrderEntity } from '~/entities/order.entity';
import { ReviewEntity } from '~/entities/review.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 255 })
  fullname: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  @Exclude()
  deletedAt: Date;

  @Column({ name: 'last_login_date', type: 'timestamp', nullable: true })
  @Exclude()
  lastLoginDate?: Date;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ name: 'profile_picture_url', nullable: true })
  profilePictureURL?: string;

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];

  @OneToMany(() => CartEntity, (cart) => cart.user)
  carts: CartEntity[];
}
