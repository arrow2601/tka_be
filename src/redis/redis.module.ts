import { Global, Module } from '@nestjs/common';
import { CacheModule,  } from '@nestjs/cache-manager'; // Impor CacheStore
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
          password: process.env.REDIS_PASSWORD || undefined,
          // ⚠️ PENTING: TTL dalam milidetik. 1 hari = 86400000 ms
          ttl: 86400 * 1000, 
        });

        console.log('✅ Redis store connected');

        return {
          // Lakukan type assertion ke CacheStore (meskipun ini lebih untuk TypeScript)
          // untuk memastikan NestJS menerima store yang valid.
          store: store ,
          ttl: 86400 * 1000, // TTL di sini juga harus milidetik
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}