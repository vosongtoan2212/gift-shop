import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ description: 'OK' })
  @Post('login')
  async login(@Body() logInDto: LoginDTO) {
    return this.authService.login(logInDto);
  }

  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({ description: 'User registered successfully' })
  @Post('register')
  async register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Check' })
  @ApiOkResponse({ description: 'Check token' })
  @Post('check')
  async check(@Headers('Authorization') tokenHeader: string) {
    return this.authService.validateToken(tokenHeader);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiOkResponse({ description: 'New access token' })
  async refreshToken(@Headers('Authorization') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'Logout successfully' })
  async logout(@Headers('Authorization') tokenHeader: string) {
    return this.authService.logout(tokenHeader);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.validateOAuthLogin(req.user);

    // Redirect về frontend với tokens
    const frontendUrl = this.configService.get('FRONTEND_URL');
    res.redirect(
      `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${JSON.stringify(user)}`,
    );
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
    // Initiates the Facebook OAuth2 login flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.validateOAuthLogin(req.user);

    // Redirect về frontend với tokens
    const frontendUrl = this.configService.get('FRONTEND_URL');
    res.redirect(
      `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }
}
