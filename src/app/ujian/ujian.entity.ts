import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../auth/auth.entity';
import { Mapel } from '../mapel/mapel.entity';
import { BankSoal } from '../bank-soal/bank-soal.entity';

@Entity('ujian')
export class Ujian {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  nama_ujian: string;

  @Column({ type: 'text', nullable: true })
  deskripsi: string;
  @Column({ nullable: true })
  is_acak: boolean;
  @Column({ nullable: true })
  jumlah_soal: number;

  @Column({ nullable: true })
  kategori: string;

  @Column({ nullable: true })
  is_open: boolean;

  @Column({ nullable: true })
  kode: string;

  @Column({ nullable: true })
  user_id: number;
  @Column({ nullable: true })
  user_name: string;
  @Column({ nullable: true })
  nama_mapel: string;
  @Column({ nullable: true })
  mapel_id: string;

  @Column({ type: 'datetime', nullable: false })
  tanggal_mulai: Date;

  @Column({ type: 'datetime', nullable: false })
  tanggal_selesai: Date;

  @Column({ type: 'int', default: 60 })
  durasi_menit: number;

  @Column({ type: 'boolean', default: false })
  is_published: boolean;

  // relasi ke mapel
  //   @ManyToOne(() => Mapel, (mapel) => mapel.ujians, { onDelete: 'CASCADE' })
  //   mapel: Mapel;

  // relasi ke user (pembuat ujian)
 

  @Column({ type: 'text', nullable: true })
  soal: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
