import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createMailerOptions(): Promise<MailerOptions> {
    return {
      transport: this.configService.get('EMAIL_TRANSPORT'),
      defaults: {
        from: `${this.configService.get(
          'EMAIL_SENDER',
        )} <${this.configService.get('EMAIL_FROM')}>`,
      },
      template: {
        dir: __dirname + '/../templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
