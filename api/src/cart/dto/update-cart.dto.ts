import { IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @IsInt()
  @Min(1, { message: 'Quantity must be greater than or equal to 1' })
  quantity: number;
}
