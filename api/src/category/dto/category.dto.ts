import { IsNumber, IsString } from 'class-validator';

export class CategoryDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
