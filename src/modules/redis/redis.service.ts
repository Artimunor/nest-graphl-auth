import * as Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  redis: Redis.Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
    });
  }

  public async get(token: string): Promise<string> {
    return await this.redis.get(token);
  }

  public async set(
    key: string,
    value: string | number,
    expiryMode?: string,
    time?: number,
  ) {
    return await this.redis.set(key, value, expiryMode, time);
  }

  public async del(token: string): Promise<number> {
    return await this.redis.del(token);
  }
}
