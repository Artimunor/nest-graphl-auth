import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { UserDTO } from './output/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleSignIn() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req): Promise<UserDTO> {
    const user = req.user as User;
    return {
      token: this.authService.signToken(user.id),
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profilePicturePath: user.profilePicturePath,
    };
  }

  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  async linkedInSignIn() {}

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedInCallback(@Req() req): Promise<UserDTO> {
    const user = req.user as User;
    return {
      token: this.authService.signToken(user.id),
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      profilePicturePath: user.profilePicturePath,
    };
  }
}
