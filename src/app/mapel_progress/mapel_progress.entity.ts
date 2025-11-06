import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../auth/auth.entity';
import { Mapel } from '../mapel/mapel.entity';

@Entity('progress_mapel')
@Unique(['user', 'mapel']) // 1 user hanya punya 1 progress per mapel
export class ProgressMapel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.progressMapel, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Mapel, (mapel) => mapel.progressMapel, { onDelete: 'CASCADE' })
  mapel: Mapel;

  @Column({ type: 'int', default: 0 })
  xp: number; // XP per mapel

  @Column({ type: 'float', default: 0 })
  progress: number; // persentase progress (0–100)

  @Column({ type: 'int', default: 1 })
  level: number; // level per mapel (optional)

  @Column({ type: 'boolean', default: false })
  is_completed: boolean; // apakah mapel ini sudah tuntas

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
