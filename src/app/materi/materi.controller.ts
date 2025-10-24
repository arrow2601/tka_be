import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { MateriService } from './materi.service';
import { Materi } from './materi.entity';

@Controller('materi')
export class MateriController {
  constructor(private readonly materiService: MateriService) {}

  // CREATE
  @Post()
  async create(@Body() data: Partial<Materi>) {
    return this.materiService.create(data);
  }

  // READ - semua data atau berdasarkan mapel_id
  @Get()
  async findAll(@Query('mapel_id') mapel_id?: string) {
    return this.materiService.findAll(mapel_id);
  }

  // READ - berdasarkan id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.materiService.findOne(id);
  }

  // UPDATE
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Materi>) {
    return this.materiService.update(id, data);
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.materiService.remove(id);
  }
}
