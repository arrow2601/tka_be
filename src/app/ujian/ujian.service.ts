import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Ujian } from './ujian.entity';

import { BankSoal } from '../bank-soal/bank-soal.entity';
import { CreateUjianDto, UpdateUjianDto } from './create-ujian.dto';
import { User } from '../auth/auth.entity';
import { REQUEST } from '@nestjs/core';
// import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UjianService {
  constructor(
    @InjectRepository(Ujian)
    private ujianRepository: Repository<Ujian>,

    @InjectRepository(BankSoal)
    private bankSoalRepository: Repository<BankSoal>,
    // private readonly redisService: RedisService,
    @Inject(REQUEST) private req: any,
  ) {}

  /**
   * Membuat ujian baru dan mengaitkan dengan mapel, user, dan bank soal.
   */
  async create(dto: CreateUjianDto, user: User): Promise<any> {
    const save = await this.ujianRepository.save({
      ...dto,
      kode: `${new Date().getTime()}`,
      is_published: false,
      user_id: user.id,

      user_name: user.name,
      soal: JSON.stringify([]),
    });

    return {
      status: `Success `,

      data: save,
    };
  }
  async updateSync(dto: UpdateUjianDto, user: User): Promise<any> {
    const result = await this.ujianRepository.update(
      { id: dto.id, user_id: user.id }, // ← kriteria (where)
      {
        is_open: dto.is_open,
        deskripsi: dto.deskripsi,
        tanggal_mulai: dto.tanggal_mulai,
        tanggal_selesai: dto.tanggal_selesai,
        durasi_menit: dto.durasi_menit,
      }, // ← data yang mau diupdate
    );

    if (result.affected !== 1) {
      throw new NotFoundException(
        `Anda tidak memiliki akses perbaharui ujian ini`,
      );
    }

    // await this.redisService.del(`ujian_${dto.id}`);

    return {
      status: 'Success',
      data: result,
    };
  }

  async updateBylistSoal(
    id: string,
    soal: string[],
    soals: any[],
  ): Promise<any> {
    console.log('update soal untuk ujian:', id, soal);

    await this.ujianRepository.update(
      { id }, // kondisi WHERE
      { soal: JSON.stringify(soal) }, // data yang akan diupdate
    );

    // await this.redisService.del(`ujian_${id}`);

    return soals;
  }

  async updateBycreateSoal(id: string, soal: string[]): Promise<any> {
    console.log('update soal untuk ujian:', id, soal);

    await this.ujianRepository.update(
      { id }, // kondisi WHERE
      { soal: JSON.stringify(soal) }, // data yang akan diupdate
    );

    //  await this.redisService.del(`ujian_${id}`);


    return { message: 'Daftar soal ujian berhasil diperbarui' };
  }

  async findOne(id: string): Promise<any> {
    // Ambil data ujian berdasarkan id
    const ujian = await this.ujianRepository.findOne({
      where: { id },
    });

    if (!ujian) {
      throw new NotFoundException(`Ujian dengan ID ${id} tidak ditemukan`);
    }

    // Parse daftar id soal dari kolom bank_soal (JSON string)
    let soalIds: string[] = [];
    try {
      soalIds = JSON.parse(ujian.soal || '[]');
    } catch (err) {
      soalIds = [];
    }

    // Ambil semua soal yang id-nya terdapat dalam bank_soal
    const soals = soalIds.length
      ? await this.bankSoalRepository.find({
          where: { id: In(soalIds) },
        })
      : [];

    // Gabungkan hasil ujian dan daftar soal
    return {
      status: 'Success',
      data: {
        ...ujian,
        soal: soals,
      },
    };
  }

  /**
   * Mendapatkan semua ujian beserta relasi.
   */
  async findAll(): Promise<Ujian[]> {
    return await this.ujianRepository.find({
      relations: ['mapel', 'user', 'soal'],
      order: { created_at: 'DESC' },
    });
  }

  async removeSoalFromUjian(
    ujianId: string,
    soalIds: string[],
    id_soal: string,
  ): Promise<any> {
    await this.ujianRepository.update(
      { id: ujianId },
      { soal: JSON.stringify(soalIds) },
    );
    return {
      message: `Soal berhasil dihapus dari ujian`,
      id_soal: id_soal,
    };
  }

  async findAllPaginated(query: any): Promise<any> {
    const { page, limit, page_size } = query;
    const [data, total] = await this.ujianRepository.findAndCount({
      where: {
        user_id: this.req.user.id,
      },
      select: [
        'id',
        'nama_ujian',
        'kode',
        'mapel_id',
        'user_name',
        'is_published',
        'tanggal_mulai',
        'tanggal_selesai',
        'nama_mapel',
        'soal',
      ],
      order: { created_at: 'DESC' },
      skip: 0,
      take: 5,
    });

    // Hitung jumlah soal dari bank_soal JSON
    const result = data.map((ujian) => ({
      id: ujian.id,
      nama_ujian: ujian.nama_ujian,
      kode: ujian.kode,
      mapel_id: ujian.mapel_id,
      user_name: ujian.user_name,
      is_published: ujian.is_published,
      tanggal_mulai: ujian.tanggal_mulai,
      tanggal_selesai: ujian.tanggal_selesai,
      nama_mapel: ujian.nama_mapel,
      jumlah_soal: ujian.soal ? JSON.parse(ujian.soal).length : 0,
    }));

    return {
      status: 'Success',
      current_page: page,
      per_page: page_size,
      total_data: total,
      total_page: Math.ceil(total / page_size),
      data: result,
    };
  }

  async findAllSiswa(query: any): Promise<any> {
    const { page, limit, page_size } = query;
    const [data, total] = await this.ujianRepository.findAndCount({
      where: {
        is_published: true,
      },
      select: [
        'id',
        'nama_ujian',

        'user_name',
        'is_published',
        'tanggal_mulai',
        'tanggal_selesai',
        'nama_mapel',
      ],
      order: { created_at: 'DESC' },

      skip: 0,
      take: 5,
    });

    // Hitung jumlah soal dari bank_soal JSON
    const result = data.map((ujian) => ({
      id: ujian.id,
      nama_ujian: ujian.nama_ujian,

      user_name: ujian.user_name,
      is_published: ujian.is_published,
      tanggal_mulai: ujian.tanggal_mulai,
      tanggal_selesai: ujian.tanggal_selesai,
      nama_mapel: ujian.nama_mapel,
    }));

    return {
      status: 'Success',
      current_page: page,
      per_page: page_size,
      total_data: total,
      total_page: Math.ceil(total / page_size),
      data: result,
    };
  }

  async findOnePublic(id: string): Promise<any> {

    // Ambil data ujian berdasarkan id
    const ujian = await this.ujianRepository.findOne({
      where: { id },
    });
    

    if (!ujian) {
      throw new NotFoundException(`Ujian dengan ID ${id} tidak ditemukan`);
    }

    // Parse daftar id soal dari kolom bank_soal (JSON string)
    let soalIds: string[] = [];
    try {
      soalIds = JSON.parse(ujian.soal || '[]');
    } catch (err) {
      soalIds = [];
    }

    // Ambil semua soal yang id-nya terdapat dalam bank_soal
    const soals = soalIds.length
      ? await this.bankSoalRepository.find({
          where: { id: In(soalIds) },
        })
      : [];

    // await this.redisService.set(
    //   `ujian_${id}`,
    //   {
    //     ...ujian,
    //     soal: soals,
    //   },
    //   6000,
    // );

    // Gabungkan hasil ujian dan daftar soal
    return {
      status: 'Success',
      data: {
        ...ujian,
        message: 'db',
        soal: soals,
      },
    };
  }
}
