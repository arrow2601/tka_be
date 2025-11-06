import { Module } from '@nestjs/common';
import { MapelProgressController } from './mapel_progress.controller';
import { MapelProgressService } from './mapel_progress.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressMapel } from './mapel_progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgressMapel])],
  controllers: [MapelProgressController],
  providers: [MapelProgressService]
})
export class MapelProgressModule {}
