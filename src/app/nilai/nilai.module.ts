import { Module } from '@nestjs/common';
import { NilaiController } from './nilai.controller';
import { NilaiService } from './nilai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nilai } from './nilai.entity';
import { UjianModule } from '../ujian/ujian.module';

@Module({
  imports: [TypeOrmModule.forFeature([Nilai]),UjianModule],
  controllers: [NilaiController],
  providers: [NilaiService],
})
export class NilaiModule {}
