// redis.config.ts
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';

export const config: CacheModuleOptions = {
  store: async () =>
    await redisStore({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      password: process.env.REDIS_PASSWORD || "",
      ttl: 86400, // default TTL 1 hari
    }),
};
