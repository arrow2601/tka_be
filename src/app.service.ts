import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly redis: RedisService) {}

  async onModuleInit() {
    await this.redis.testConnection();
    
  }

  
}
