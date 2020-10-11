import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(
    private userService: UserService,
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
    configService: ConfigService,
  ) {
    super({
      clientID: configService.get('LINKEDIN_CLIENT_ID'),
      clientSecret: configService.get('LINKEDIN_CLIENT_SECRET'),
      callbackURL: 'http://localhost:4000/auth/linkedin/callback',
      passReqToCallback: true,
      scope: ['r_liteprofile', 'r_emailaddress'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    try {
      console.log(profile);
      let user = await this.userService.findByEmail(profile.emails[0].value);
      if (!user) {
        user = new User();
      }

      user.email = profile.emails[0].value;
      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.profilePicturePath = profile.photos[0].value;
      user.linkedInToken = accessToken;
      user.linkedInRefreshToken = refreshToken;
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
