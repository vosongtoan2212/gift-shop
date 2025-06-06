import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BrandEntity } from '~/entities/brand.entity';
import { CartEntity } from '~/entities/cart.entity';
import { CategoryEntity } from '~/entities/category.entity';
import { ReviewEntity } from '~/entities/review.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @Column()
  categoryId: number;

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @Column()
  brandId: number;

  @OneToMany(() => CartEntity, (cart) => cart.product)
  carts: CartEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.product)
  reviews: ReviewEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
