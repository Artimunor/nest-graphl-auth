import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtInput } from '../input/jwt.input';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtInput) {
    const token = request.headers.authorization.split(' ')[1];
    const blacklisted = await this.authService.isJwtBlacklisted(token);
    if (blacklisted) {
      throw new UnauthorizedException();
    }
    const { password, ...user } = await this.authService.validateUser(
      payload.userId,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
