import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  IsPositive,
} from 'class-validator';
import { BrandDTO } from '~/brand/dto/brand.dto';
import { CategoryDTO } from '~/category/dto/category.dto';

export class ProductDTO {
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  categoryId: number;

  @IsInt()
  brandId: number;

  @IsOptional()
  category?: CategoryDTO;
  @IsOptional()
  brand?: BrandDTO;

  createdAt: Date;
  updatedAt: Date;
}
