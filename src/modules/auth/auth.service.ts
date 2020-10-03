import * as bcrypt from 'bcryptjs';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-express';
import { AccessToken } from './output/AccessToken';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    Logger.log(
      'email: ' + email + ' password: ' + password,
      'AuthService.validateUser',
    );
    const user = await this.usersService.findByEmail(email);

    const valid = await bcrypt.compare(password, user.password);
    if (user && valid) {
      const { password, ...result } = user;
      return result;
    }

    return false;
  }

  validateToken(token: string): boolean {
    Logger.log('token: ' + token, 'AuthService.validateToken');
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new AuthenticationError('Not Authenticated');
    }
  }

  login(email: string, password: string): AccessToken {
    const payload = { email: email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // async logout(ctx: GqlContext) {
  //   await ctx.req.session.destroy(err => {
  //     console.log(err);
  //     return false;
  //   });
  //   await ctx.res.clearCookie('votingapp');
  //   return true;
  // }
}
