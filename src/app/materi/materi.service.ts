import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materi } from './materi.entity';

@Injectable()
export class MateriService {
  constructor(
    @InjectRepository(Materi)
    private readonly materiRepo: Repository<Materi>,
  ) {}

  async create(data: Partial<Materi>) {
    const materi = this.materiRepo.create(data);
    return await this.materiRepo.save(materi);
  }

  async findAll(mapelId?: string) {
    const where = mapelId ? { mapel_id: mapelId } : {};
    return await this.materiRepo.find({ where });
  }

  async findOne(id: number) {
    const materi = await this.materiRepo.findOne({ where: { id } });
    if (!materi) throw new NotFoundException('Materi tidak ditemukan');
    return materi;
  }

  async update(id: number, data: Partial<Materi>) {
    const materi = await this.findOne(id);
    Object.assign(materi, data);
    return await this.materiRepo.save(materi);
  }

  async remove(id: number) {
    const materi = await this.findOne(id);
    await this.materiRepo.remove(materi);
    return { message: 'Materi berhasil dihapus' };
  }
}
