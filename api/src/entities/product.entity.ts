import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BrandEntity } from '~/entities/brand.entity';
import { CategoryEntity } from '~/entities/category.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  category: CategoryEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.products)
  brand: BrandEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
