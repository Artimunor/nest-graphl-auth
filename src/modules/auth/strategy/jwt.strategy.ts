import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtInput } from '../input/jwt.input';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'x', //configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtInput) {
    const user = await this.authService.validateUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
