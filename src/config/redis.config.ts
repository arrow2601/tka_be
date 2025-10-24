import { RedisOptions, Transport } from '@nestjs/microservices';
import { config as dotenv } from 'dotenv';

dotenv();

export const redisConfig: RedisOptions = {
  transport: Transport.REDIS,
  options: {
    host: `${process.env.REDIS_HOST}`,
    port: Number(process.env.REDIS_PORT),
    password: `${process.env.REDIS_PASSWORD}`,
  },
};