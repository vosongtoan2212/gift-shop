import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('brands')
export class BrandEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  products: ProductEntity[];
}
