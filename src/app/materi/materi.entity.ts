// src/entities/materi.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Mapel } from '../mapel/mapel.entity';

@Entity('materi')
export class Materi extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nama_materi: string;

  @Column({ nullable: false })
  tingkat_sekolah: string; // cpns, sd, smp, sma, umum

  @Column({ nullable: false })
  mapel_id: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;
}
