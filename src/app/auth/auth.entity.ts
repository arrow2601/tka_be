import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Ujian } from '../ujian/ujian.entity';
import { Nilai } from '../nilai/nilai.entity';
import { ProgressMapel } from '../mapel_progress/mapel_progress.entity';
import { Gamifikasi } from '../gamifikasi/gamifikasi.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  foto_profile: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  role: string;

  @OneToMany(() => ProgressMapel, (ump) => ump.user)
  progressMapel: ProgressMapel[];
  @OneToMany(() => Gamifikasi, (g) => g.user)
  gamifikasi: Gamifikasi[];

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
