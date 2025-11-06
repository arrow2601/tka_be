import { Module } from '@nestjs/common';
import { GamifikasiController } from './gamifikasi.controller';
import { GamifikasiService } from './gamifikasi.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gamifikasi } from './gamifikasi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gamifikasi])],
  controllers: [GamifikasiController],
  providers: [GamifikasiService],
})
export class GamifikasiModule {}
