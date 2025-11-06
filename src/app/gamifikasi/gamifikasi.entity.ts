import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { User } from '../auth/auth.entity';

@Entity('gamifikasi')
@Unique(['user'])
export class Gamifikasi {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.gamifikasi, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int', default: 0 })
  total_xp: number; // total XP global

  @Column({ type: 'int', default: 1 })
  level: number; // level global pengguna

  @Column({ type: 'text', nullable: true })
  badges: string; // simpan badge sebagai JSON string (misalnya: ["Rookie", "Math Master"])

  @Column({ type: 'int', default: 0 })
  total_completed_mapel: number; // berapa mapel sudah tuntas

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
