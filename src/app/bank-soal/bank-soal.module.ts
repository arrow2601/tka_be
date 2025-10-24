import { Module } from '@nestjs/common';
import { BankSoalService } from './bank-soal.service';
import { BankSoalController } from './bank-soal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mapel } from '../mapel/mapel.entity';
import { BankSoal } from './bank-soal.entity';
import { UjianModule } from '../ujian/ujian.module';



@Module({
   imports: [TypeOrmModule.forFeature([Mapel, BankSoal]), UjianModule], 
  providers: [BankSoalService],
  controllers: [BankSoalController]
})
export class BankSoalModule {}
