import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../auth/auth.entity';

@Entity('nilai')
export class Nilai {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relasi ke Entitas Ujian

  @Column({ nullable: false })
  ujian_id: string; // Kolom untuk menyimpan ID Ujian secara langsung (opsional, tergantung preferensi)

  // Relasi ke Entitas User (Pengambil Ujian)
 

  @Column({ nullable: false })
  user_id: string; // Kolom untuk menyimpan ID User secara langsung

  // --- Waktu Pengerjaan Ujian ---
  @Column({ type: 'datetime', nullable: true })
  waktu_mulai: Date; // Waktu user mulai mengerjakan ujian

  @Column({ type: 'datetime', nullable: true })
  waktu_selesai: Date; // Waktu user selesai/mengumpulkan ujian

  @Column({ type: 'int', nullable: true })
  sisa_waktu: number; // Sisa waktu dalam detik/menit saat dikumpulkan

  @Column({ type: 'int', nullable: true })
  total_waktu_pengerjaan: number; // Total waktu pengerjaan (menit/detik)

  // --- Jawaban dan Nilai ---
  @Column({ type: 'json', nullable: true })
  jawaban_user: any; // Menyimpan jawaban user (misalnya, array of objects [{soal_id, jawaban}])

  @Column({ type: 'json', nullable: true })
  detail_jawaban: any; // Menyimpan jawaban user (misalnya, array of objects [{soal_id, jawaban}])

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  nilai: number; // Nilai akhir yang didapat (misalnya, 85.50)

  @Column({nullable : true})
  history_nilai: string; // Nilai akhir yang didapat (misalnya, 85.50)

  // --- Status Ujian ---
  @Column({
    type: 'enum',
    enum: ['PENDING', 'ONGOING', 'SUBMITTED', 'EXPIRED'],
    default: 'PENDING',
  })
  status_pengerjaan: string; // Status pengerjaan ujian oleh user

  @Column({ type: 'int', nullable: true })
  repeat_count: number; // Nilai akhir yang didapat (misalnya, 85.50)

  // --- Tambahan yang Mungkin Diperlukan ---
  @Column({ type: 'text', nullable: true })
  keterangan: string; // Catatan tambahan terkait nilai/ujian ini

  @CreateDateColumn()
  created_at: Date; // Waktu record nilai dibuat

  @UpdateDateColumn()
  updated_at: Date; // Waktu record nilai terakhir diperbarui
}
