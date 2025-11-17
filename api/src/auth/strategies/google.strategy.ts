import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
     console.log('GOOGLE_CLIENT_ID =', configService.get('GOOGLE_CLIENT_ID'));
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {

    const { id, name, emails, photos } = profile;

    // Kiểm tra và lấy dữ liệu an toàn
    const email = emails && emails.length > 0 ? emails[0].value : null;
    const profilePictureURL = photos && photos.length > 0 ? photos[0].value : null;
    const firstName = name?.givenName || '';
    const lastName = name?.familyName || '';

    // Nếu không có email, không cho phép đăng nhập
    if (!email) {
      return done(new Error('Email không được cung cấp bởi Google'), null);
    }

    const user = {
      googleId: id,
      email,
      fullname: `${firstName} ${lastName}`.trim() || email.split('@')[0],
      profilePictureURL,
      authProvider: 'google',
    };

    done(null, user);
  }
}
