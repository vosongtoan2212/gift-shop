import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
