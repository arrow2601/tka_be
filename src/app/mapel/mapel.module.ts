import { Module } from '@nestjs/common';
import { MapelService } from './mapel.service';
import { MapelController } from './mapel.controller';
import { Mapel } from './mapel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Mapel])],
  providers: [MapelService],
  controllers: [MapelController],
})
export class MapelModule {}
