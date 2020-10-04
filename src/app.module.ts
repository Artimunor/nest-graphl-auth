import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './modules/redis/redis.module';
import { ConfigService } from '@nestjs/config';
import { GraphqlConfigService } from './config/graphql.config';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TypeOrmConfigService } from './config/typeorm.config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthGuard } from './modules/auth/guards/gql.auth.guard';
import { MailerConfigService } from './config/mailer.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
