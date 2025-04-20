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
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const payloadAccessToken = {
      email: user.email,
      sub: user.id,
      fullname: user.fullname,
      profilePictureURL: user.profilePictureURL,
    };
    const payloadRefreshToken = {
      email: user.email,
      sub: user.id,
    };
    const accessToken = await this.jwtService.sign(payloadAccessToken, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.sign(payloadRefreshToken, {
      expiresIn: '7d',
    });

    // Lưu refreshToken vào DB để quản lý
    await this.userService.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user: payloadAccessToken };
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

  async validateToken(tokenHeader: string): Promise<any> {
    let token = '';
    const parts = tokenHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token', error);
    }
  }

  async refreshToken(refreshTokenHeader: string) {
    let token = '';
    const parts = refreshTokenHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
    try {
      const decoded = this.jwtService.verify(token);

      const user = await this.userService.findOneById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      // Kiểm tra refreshToken có khớp không
      if (user.refreshToken !== token) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = {
        email: user.email,
        sub: user.id,
        fullname: user.fullname,
        profilePictureURL: user.profilePictureURL,
      };
      const newAccessToken = await this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      return { accessToken: newAccessToken, user: payload };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
        error,
      );
    }
  }

  async logout(tokenHeader: string) {
    const decoded = await this.validateToken(tokenHeader);

    // Xoá refreshToken trong DB (hoặc Redis)
    await this.userService.removeRefreshToken(decoded.sub);

    return { message: 'Logout successfully' };
  }
}
