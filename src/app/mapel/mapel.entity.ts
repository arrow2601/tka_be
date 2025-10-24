import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { BankSoal } from '../bank-soal/bank-soal.entity';
import { Ujian } from '../ujian/ujian.entity';

@Entity('mapel')
export class Mapel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama_mapel: string;

  @Column({ nullable: true })
  deskripsi: string;

  @OneToMany(() => BankSoal, (bankSoal) => bankSoal.mapel)
  bankSoal: BankSoal[];
//   @OneToMany(() => Ujian, (ujian) => ujian.mapel)
//   ujians: Ujian[];

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
