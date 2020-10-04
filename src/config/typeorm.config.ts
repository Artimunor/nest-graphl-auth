import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const options = {
      type: this.configService.get('TYPEORM_CONNECTION'),
      host: this.configService.get('TYPEORM_HOST', 'localhost'),
      port: this.configService.get<number>('TYPEORM_PORT', 5432),
      username: this.configService.get('TYPEORM_USERNAME'),
      password: this.configService.get('TYPEORM_PASSWORD'),
      database: this.configService.get('TYPEORM_DATABASE'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: this.configService.get('TYPEORM_SYNCHRONIZE'),
      logging: this.configService.get('TYPEORM_LOGGING'),
    } as TypeOrmModuleOptions;
    return options;
  }
}
