import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { BankSoal } from './bank-soal.entity';
import { Mapel } from '../mapel/mapel.entity';
import { User } from '../auth/auth.entity';
import { UjianService } from '../ujian/ujian.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class BankSoalService {
  constructor(
    @InjectRepository(BankSoal)
    private readonly bankSoalRepo: Repository<BankSoal>,

    private readonly ujianService: UjianService,
    @Inject(REQUEST) private req: any,
  ) {}

  async createOne(data: any, userId: number): Promise<any> {
    const { jawaban, soal } = data;

    // const mapel = await this.mapelRepo.findOne({ where: { id: mapel_id } });
    delete data.id;

    console.log('Data', data);

    const save = await this.bankSoalRepo.save({
      ...data,
      nama_guru: this.req.user.name,

      mapel: {
        id: data.mapel_id,
      },
      jawaban: jawaban ? JSON.stringify(jawaban) : null,
      soal: soal ? JSON.stringify(soal) : null,
      user: {
        id: userId,
      },
    });

    this.ujianService.updateBycreateSoal(data.ujian_id, [
      ...data.banksoal,
      save.id,
    ]);
    return {
      status: `Success `,
      data: {
        id: save.id,
        mapel_id: save.mapel.id,
        jawaban: save.jawaban,
        materi: save.materi,
        point: save.point,
        created_at: save.created_at,
        tipe: save.tipe,
        soal: save.soal,
        ujian_id: save.ujian_id,
        pembahasan: save.pembahasan,
        tingkat_kesulitan: save.tingkat_kesulitan,
        tingkat_sekolah: save.tingkat_sekolah,
        is_public: save.is_public,
      },
    };
  }

  async updateOne(data: any, userId: number): Promise<any> {
    const { mapel_id, materi, point, tipe, banksoal, jawaban, soal } = data;

    const save = await this.bankSoalRepo.save({
      ...data,
      mapel: {
        id: data.mapel_id,
      },
      jawaban: jawaban ? JSON.stringify(jawaban) : null,
      soal: soal ? JSON.stringify(soal) : null,
      // user: {
      //   id: userId,
      // },
    });

    return {
      status: `Success `,
      data: save,
    };
  }

  async findAll(query: any) {
    const {
      page = 1,
      limit = 10,
      mapel_id,
      tipe,
      tingkat_kesulitan,
      tingkat_sekolah,
      is_public,
      keyword,
    } = query;

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    // 🔍 Filter dinamis
    const where: FindOptionsWhere<BankSoal> = {};

    where.mapel = { id: mapel_id };

    if (tipe) {
      where.tipe = tipe;
    }

    if (tingkat_kesulitan) {
      where.tingkat_kesulitan = tingkat_kesulitan;
    }

    if (tingkat_sekolah) {
      where.tingkat_sekolah = tingkat_sekolah;
    }

    // 🔍 Pencarian kata kunci di "materi" atau "soal"
    if (keyword) {
      where.materi = Like(`%${keyword}%`);
    }

    const [data, total] = await this.bankSoalRepo.findAndCount({
      where,
      // relations: ['mapel', 'user'],
      order: { created_at: 'DESC' },
      take,
      skip,
    });

    return {
      status: 'Success',
      page: Number(page),
      limit: Number(limit),
      total,
      total_page: Math.ceil(total / take),
      data,
    };
  }
}
