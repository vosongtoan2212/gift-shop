import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '~/user/user.service';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login({ email, password }: LoginDTO) {
    // Xác thực thông tin đăng nhập
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Tạo token JWT
    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.sign(payload);

    // Trả về token cho người dùng
    return { accessToken };
  }

  async register(registerDto: RegisterDTO) {
    try {
      const newUser = await this.userService.register(registerDto);
      return { message: 'User registered successfully', user: newUser };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('User registration failed');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  // Hàm kiểm tra token có hợp lệ không
  async validateToken(tokenHeader: string): Promise<boolean> {
    let token = '';
    const parts = tokenHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1]; // Phần thứ hai là token
    }
    try {
      // Kiểm tra token với JwtService
      const decoded = this.jwtService.verify(token);

      // Token hợp lệ nếu không ném ra lỗi
      return decoded;
    } catch (error) {
      // Nếu token không hợp lệ hoặc hết hạn, ném lỗi Unauthorized
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
