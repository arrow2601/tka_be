import { Module } from '@nestjs/common';
import { MateriController } from './materi.controller';
import { MateriService } from './materi.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materi } from './materi.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Materi])], 
  controllers: [MateriController],
  providers: [MateriService]
})
export class MateriModule {}
