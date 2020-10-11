import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './modules/redis/redis.module';
import { GraphqlConfigService } from './config/graphql.config';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmConfigService } from './config/typeorm.config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { MailerConfigService } from './config/mailer.config';
import { RoleModule } from './modules/role/role.module';
import { AuthController } from './modules/auth/auth.controller';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { MulterConfigService } from './config/multer.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    RoleModule,
    AuthModule,
    RedisModule,
    GraphQLModule.forRootAsync({
      useClass: GraphqlConfigService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
