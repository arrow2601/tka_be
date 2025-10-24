import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './app/auth/auth.module';
import { BankSoalModule } from './app/bank-soal/bank-soal.module';
import { UjianModule } from './app/ujian/ujian.module';
import { NilaiModule } from './app/nilai/nilai.module';
import { APP_GUARD } from '@nestjs/core';
import { MapelModule } from './app/mapel/mapel.module';
import { MateriModule } from './app/materi/materi.module';
import { RedisModule } from './redis/redis.module';
import { AppService } from './app.service';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time-to-live (waktu hidup) dalam milidetik (60 detik)
        limit: 100, // Jumlah permintaan yang diizinkan dalam rentang waktu tersebut
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true, // konfigurasi is global untuk semua module
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const { typeOrmConfig } = await import('./config/typeorm.config');
        return typeOrmConfig;
      },
    }),
    AuthModule,
    BankSoalModule,
    UjianModule,
    NilaiModule,
    MapelModule,
    MateriModule,
    RedisModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
