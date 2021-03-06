import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userService: UserService,
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:4000/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      let user = await this.userService.findByEmail(profile.emails[0].value);
      if (!user) {
        user = new User();
      }

      user.email = profile.emails[0].value;
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.profilePicturePath = profile.photos[0].value;
      user.googleToken = accessToken;
      user.googleRefreshToken = refreshToken;
      const {
        password,
        ...returnUser
      } = await this.userService.userCreateOrUpdate(user);
      done(null, returnUser);
    } catch (err) {
      done(err, false);
    }
  }
}
