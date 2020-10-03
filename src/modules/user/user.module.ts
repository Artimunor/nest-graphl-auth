import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../redis/redis.module';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { GqlAuthGuard, LocalAuthGuard } from '../auth/guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisModule,
    GqlAuthGuard,
    LocalAuthGuard,
  ],
  providers: [UserResolver, UserService, User],
  exports: [UserService],
})
export class UserModule {}
