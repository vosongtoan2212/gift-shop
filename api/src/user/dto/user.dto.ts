import { IsString } from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  fullname: string;
}

export class ChangePasswordDTO {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
