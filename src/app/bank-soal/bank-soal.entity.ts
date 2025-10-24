import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { User } from '../auth/auth.entity'; // relasi ke user
import { Mapel } from '../mapel/mapel.entity'; // jika kamu punya entity Mapel
import { Ujian } from '../ujian/ujian.entity';

@Entity('bank_soal')
export class BankSoal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  materi: string;

  @ManyToOne(() => Mapel, (mapel) => mapel.bankSoal, { nullable: false })
  @JoinColumn({ name: 'mapel_id' })
  mapel: Mapel;

  @Column({ type: 'int', default: 1 })
  point: number;

  @Column({ type: 'varchar', length: 10 })
  tipe: string; // contoh: 'PG', 'MCMA', 'MTF', 'ES'

  @Column({ type: 'text' })
  soal: string;
  

  @Column({  nullable: true, type:"text" })
  pembahasan: string;

  @Column({ nullable: true })
  tingkat_kesulitan: string;

  @Column()
  is_public: number;

  @Column({ nullable: true })
  nama_guru: string;

  

  @Column({ nullable: true })
  tingkat_sekolah: string;
  // Disimpan sebagai JSON string (pertanyaan + pilihan)

  @Column({ type: 'text', nullable: true })
  jawaban: string;
  // Disimpan sebagai JSON string (misal "A" atau ["A","C"])

  // === Relasi ke User (pembuat soal) ===
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

 

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
