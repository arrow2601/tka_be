import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/app/auth/auth.entity';
import { BankSoal } from 'src/app/bank-soal/bank-soal.entity';
import { Mapel } from 'src/app/mapel/mapel.entity';
import { Materi } from 'src/app/materi/materi.entity';
import { Nilai } from 'src/app/nilai/nilai.entity';
import { Ujian } from 'src/app/ujian/ujian.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), 
  username: process.env.DB_USERNAME, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE,
  entities: [User, Mapel, Materi, BankSoal, Ujian, Nilai],
  synchronize: true,
  // logging: true,
};