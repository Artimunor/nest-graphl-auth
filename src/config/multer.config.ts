import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express/multer/interfaces/files-upload-module.interface';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createMulterOptions(): Promise<MulterModuleOptions> {
    return {
      dest: this.configService.get('MULTER_DEST'),
    };
  }
}
