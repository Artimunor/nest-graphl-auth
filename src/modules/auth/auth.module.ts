import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { GqlAuthGuard } from './guards/gql.auth.guard';
import { JwtConfigService } from '../../config/jwt.config';
import { AuthController } from './auth.controller';
import { LinkedInStrategy } from './strategy/linkedin.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { AvatarController } from './avatar.controller';

@Module({
  imports: [
    UserModule,
    RedisModule,
    PassportModule.register({ session: true }),
    MailerModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  providers: [
    AuthController,
    AvatarController,
    AuthResolver,
    AuthService,
    GqlAuthGuard,
    JwtStrategy,
    GoogleStrategy,
    LinkedInStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
