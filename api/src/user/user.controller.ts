import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '~/guard/jwt.guard';
import { ChangePasswordDTO, UpdateProfileDTO } from '~/user/dto/user.dto';
// import { UpdateProfileDTO, ChangePasswordDTO } from './dto/user.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ description: 'User profile data' })
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getProfile(req.user);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({ description: 'Update success' })
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDTO,
  ) {
    return this.userService.updateProfile(req.user, updateProfileDto);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiOkResponse({ description: 'Password changed' })
  @Put('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDTO,
  ) {
    return this.userService.changePassword(req.user, changePasswordDto);
  }
}
