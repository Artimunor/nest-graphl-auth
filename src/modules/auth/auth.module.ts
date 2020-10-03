import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategy/jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    UserModule,
    RedisModule,
    PassportModule.register({ session: true }),
    MailerModule,
    JwtModule.register({
      secret: 'x',
    }),
  ],
  providers: [AuthResolver, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
