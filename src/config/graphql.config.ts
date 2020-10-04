import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}
  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      debug: this.configService.get('GQL_DEBUG'),
      playground: this.configService.get('GQL_PLAYGROUND'),
    };
  }
}
