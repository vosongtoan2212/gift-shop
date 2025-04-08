import { IsNumber, IsString } from 'class-validator';

export class BrandDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
