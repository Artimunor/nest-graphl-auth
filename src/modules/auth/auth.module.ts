import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { GqlAuthGuard } from './guards/gql.auth.guard';
import { JwtConfigService } from '../../config/jwt.config';

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
  providers: [AuthResolver, AuthService, GqlAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
