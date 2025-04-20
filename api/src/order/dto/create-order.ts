import { IsArray, IsNumber, IsString, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  orderItems: CreateOrderItemDto[];
}
