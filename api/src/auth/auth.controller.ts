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

  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({ description: 'User registered successfully' })
  @Post('check')
  async check(@Headers('Authorization') tokenHeader: string) {
    return this.authService.validateToken(tokenHeader);
  }
}
