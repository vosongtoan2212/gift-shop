import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  stock: number = 0;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  categoryId: number;

  @IsInt()
  brandId: number;
}
