import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '~/entities/user.entity';
import { UserRepository } from './user.repository';
import { RegisterDTO } from '~/auth/dto/auth.dto';
import { ChangePasswordDTO, UpdateProfileDTO } from '~/user/dto/user.dto';
// import { UpdateProfileDTO } from '~/user/dto/user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  // Lấy thông tin user từ token
  async getProfile(payloadToken: any): Promise<UserEntity> {
    const user = await this.findOneById(payloadToken.sub);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(payloadToken: any, dto: UpdateProfileDTO) {
    const updatedUser = await this.userRepository.preload({
      id: payloadToken.sub,
      ...dto,
    });
    if (!updatedUser) {
      throw new Error('User not found');
    }

    const savedUser = await this.userRepository.save(updatedUser);

    return {
      message: 'Update success',
      updatedUser: savedUser,
    };
  }

  async changePassword(payloadToken: any, dto: ChangePasswordDTO) {
    const user = await this.findOneById(payloadToken.sub);

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong password');
    }

    const hash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.update(payloadToken.sub, { password: hash });

    return { message: 'Password changed successfully' };
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ email });
  }

  async checkEmailExited(email: string): Promise<boolean> {
    const user = await this.findOneByEmail(email);
    return !!user;
  }

  async register(registerDto: RegisterDTO): Promise<UserEntity> {
    const { email, password, fullname } = registerDto;

    // Kiểm tra xem người dùng có tồn tại chưa
    const userExists = await this.checkEmailExited(email);
    if (userExists) {
      throw new ConflictException('Email has been registered');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo đối tượng UserEntity mới
    const newUser = this.userRepository.create({
      password: hashedPassword,
      email,
      fullname,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.save(newUser);

    // Lưu người dùng vào cơ sở dữ liệu
    return newUser;
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userRepository.update(userId, { refreshToken });
  }

  async removeRefreshToken(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });
  }
}
