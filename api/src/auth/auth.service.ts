import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserService } from '~/user/user.service';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { UserEntity } from '~/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
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
      role: user.role,
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

  async validateOAuthLogin(
    profile: any,
  ): Promise<{ accessToken: string; refreshToken: string; user: UserEntity }> {
    let user: UserEntity;

    // Tìm user theo Google ID hoặc Facebook ID
    if (profile.googleId) {
      user = await this.userRepository.findOne({
        where: { googleId: profile.googleId },
      });
    } else if (profile.facebookId) {
      user = await this.userRepository.findOne({
        where: { facebookId: profile.facebookId },
      });
    }

    // Nếu chưa có user, tìm theo email
    if (!user && profile.email) {
      user = await this.userRepository.findOne({
        where: { email: profile.email },
      });

      // Nếu tìm thấy user với email, cập nhật thông tin OAuth
      if (user) {
        if (profile.googleId) user.googleId = profile.googleId;
        if (profile.facebookId) user.facebookId = profile.facebookId;
        user.authProvider = profile.authProvider;
        if (profile.profilePictureURL && !user.profilePictureURL) {
          user.profilePictureURL = profile.profilePictureURL;
        }
        await this.userRepository.save(user);
      }
    }

    // Nếu vẫn chưa có user, tạo mới
    if (!user) {
      user = this.userRepository.create({
        email: profile.email,
        fullname: profile.fullname,
        googleId: profile.googleId,
        facebookId: profile.facebookId,
        profilePictureURL: profile.profilePictureURL,
        authProvider: profile.authProvider,
        password: null, // OAuth không cần password
      });
      await this.userRepository.save(user);
    }

    // Cập nhật last login
    user.lastLoginDate = new Date();

    // Tạo tokens
    const payload = {
      email: user.email,
      sub: user.id,
      fullname: user.fullname,
      role: user.role,
      profilePictureURL: user.profilePictureURL,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Lưu refresh token
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.save(user);

    return { accessToken, refreshToken, user };
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
