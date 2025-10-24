// src/redis/redis.service.ts
import { CACHE_MANAGER } from '@nestjs/cache-manager'; // ✅ dari sini, bukan @nestjs/common
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async set(key: string, value: any, ttl = 60) {
    
    await this.cache.set(key, value, ttl * 1000);
  }

  async get<T>(key: string): Promise<T | null> {
    return (await this.cache.get(key)) as T;
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  async testConnection() {
    await this.cache.set('ping', 'pong', 10);
    const val = await this.cache.get('ping');
    console.log('✅ Redis connected:', val);
  }
}
