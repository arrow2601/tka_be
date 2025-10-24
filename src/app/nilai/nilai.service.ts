import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Nilai } from './nilai.entity'; // Pastikan path benar
import { UjianService } from '../ujian/ujian.service'; // Asumsi path dan nama service ujian
import { CreateNilaiDto, jawabanDto } from './nilai.dto';
import { ResponseSuccess } from 'src/utils/response';
import { REQUEST } from '@nestjs/core';

// Interface untuk struktur data
interface JawabanSiswa {
  jawaban: any;
  ragu: boolean;
  dijawab: boolean;
}

interface Soal {
  id: string;
  materi: string;
  point: number;
  tipe: 'PG' | 'MTF' | 'MCMA';
  jawaban: string;
}

interface HasilPerhitungan {
  totalPoint: number;
  pointDidapat: number;
  nilaiAkhir: number;
  detailPerSoal: {
    [soalId: string]: {
      benar: boolean;
      point: number;
      pointDidapat: number;
      materi: string;
    };
  };
}

@Injectable()
export class NilaiService {
  constructor(
    @InjectRepository(Nilai)
    private nilaiRepository: Repository<Nilai>,
    private ujianService: UjianService, // Inject UjianService
    @Inject(REQUEST) private req: any,
  ) {}

  /**
   * Memulai atau melanjutkan ujian untuk user yang diberikan.
   * Melakukan pengecekan waktu dan sisa durasi.
   * @param createDto Data yang berisi ujian_id dan user_id.
   * @returns Data ujian yang difilter, entri nilai, dan sisa waktu.
   */

  private hitungNilaiAkhir(
    jawabanUser: { [soalId: string]: JawabanSiswa },
    soalList: Soal[],
  ): HasilPerhitungan {
    let totalPoint = 0;
    let pointDidapat = 0;
    const detailPerSoal: {
      [soalId: string]: {
        benar: boolean;
        point: number;
        pointDidapat: number;
        materi: string;
      };
    } = {};

    // Hitung total point
    soalList.forEach((soal) => {
      totalPoint += soal.point;
    });

    // Proses perhitungan per soal
    soalList.forEach((soal) => {
      const jawabanSiswa = jawabanUser[soal.id];

      if (!jawabanSiswa || !jawabanSiswa.dijawab) {
        // Jika tidak dijawab, dapat 0 point
        detailPerSoal[soal.id] = {
          benar: false,
          point: soal.point,
          pointDidapat: 0,
          materi: soal.materi,
        };
        return;
      }

      let benar = false;
      const kunciJawaban = JSON.parse(soal.jawaban);

      switch (soal.tipe) {
        case 'PG':
          // Untuk PG, bandingkan langsung jawabannya
          benar = jawabanSiswa.jawaban === kunciJawaban;
          break;

        case 'MTF':
          // Untuk MTF, harus sama persis urutannya
          if (
            Array.isArray(jawabanSiswa.jawaban) &&
            Array.isArray(kunciJawaban)
          ) {
            benar =
              jawabanSiswa.jawaban.length === kunciJawaban.length &&
              jawabanSiswa.jawaban.every(
                (val: any, index: number) => val === kunciJawaban[index],
              );
          }
          break;

        case 'MCMA':
          // Untuk MCMA, tidak memperhatikan urutan, hanya set equality
          if (
            Array.isArray(jawabanSiswa.jawaban) &&
            Array.isArray(kunciJawaban)
          ) {
            const jawabanSorted = [...jawabanSiswa.jawaban].sort();
            const kunciSorted = [...kunciJawaban].sort();
            benar =
              jawabanSorted.length === kunciSorted.length &&
              jawabanSorted.every(
                (val: any, index: number) => val === kunciSorted[index],
              );
          }
          break;

        default:
          benar = false;
      }

      const pointSoalDidapat = benar ? soal.point : 0;
      pointDidapat += pointSoalDidapat;

      detailPerSoal[soal.id] = {
        benar,
        point: soal.point,
        pointDidapat: pointSoalDidapat,
        materi: soal.materi,
      };
    });

    const nilaiAkhir = totalPoint > 0 ? (pointDidapat / totalPoint) * 100 : 0;

    return {
      totalPoint,
      pointDidapat,
      nilaiAkhir,
      detailPerSoal,
    };
  }

  async saveProgress(id: string, jawaban_user: any): Promise<ResponseSuccess> {
    console.log(jawaban_user);
    console.log('id', id);

    await this.nilaiRepository.save({
      jawaban_user: JSON.stringify(jawaban_user),
      id: id,
    });

    return {
      status: 'Success',
    };
  }

  async saveSubmit(
    ujian_id: string,
    nilai_id: string,
    jawaban_user: any,
    history_nilai: string,
  ): Promise<ResponseSuccess> {
    console.log(jawaban_user);
    console.log('id', ujian_id);

    const ujianResponse = await this.ujianService.findOnePublic(ujian_id);

    // Hitung nilai akhir
    const hasilPerhitungan = this.hitungNilaiAkhir(
      jawaban_user,
      ujianResponse.data.soal,
    );

    await this.nilaiRepository.save({
      id: nilai_id,
      history_nilai: history_nilai
        ? history_nilai + ' , ' + `${hasilPerhitungan.nilaiAkhir.toFixed(2)}`
        : `${hasilPerhitungan.nilaiAkhir.toFixed(2)}`,

      jawaban_user: JSON.stringify(jawaban_user),
      nilai: hasilPerhitungan.nilaiAkhir,

      detail_jawaban: JSON.stringify(hasilPerhitungan.detailPerSoal),
      status_pengerjaan: 'SUBMITTED',
      waktu_selesai: new Date(),
    });

    return {
      status: 'Success',
      data: {
        nilai: hasilPerhitungan.nilaiAkhir,
      },
    };
  }

  async startUjian(createDto: CreateNilaiDto): Promise<ResponseSuccess> {
    const { ujian_id, user_id } = createDto;

    const ujianResponse = await this.ujianService.findOnePublic(ujian_id);

    if (!ujianResponse || !ujianResponse.data) {
      throw new NotFoundException(
        `Ujian dengan ID ${ujian_id} tidak ditemukan atau belum dipublikasikan.`,
      );
    }

    const ujianData = ujianResponse.data;
    const durasiTotalMenit = ujianData.durasi_menit;
    const durasiTotalMillis = durasiTotalMenit * 60 * 1000;

    const existingNilai = await this.nilaiRepository.findOne({
      where: {
        ujian_id: ujian_id,
        user_id: user_id,
        // Cari status selain PENDING (ONGOING, SUBMITTED, EXPIRED)
        status_pengerjaan: Not('PENDING'),
      },
    });

    if (existingNilai) {
      if (existingNilai.status_pengerjaan === 'SUBMITTED') {
        const waktuMulai = existingNilai.waktu_mulai.getTime();
        const waktuSekarang = new Date().getTime();

        let sisaWaktuMillis = durasiTotalMillis - (waktuSekarang - waktuMulai);

        const sisaWaktuDetik = Math.floor(sisaWaktuMillis / 1000);

        existingNilai.sisa_waktu = sisaWaktuDetik;
        const newNilai = this.nilaiRepository.create({
          ujian_id,
          user_id,
          waktu_mulai: new Date(),
          status_pengerjaan: 'ONGOING',

          // Inisialisasi sisa_waktu dengan durasi total dalam detik
          sisa_waktu: sisaWaktuDetik,
          jawaban_user: {},
        });
        const nilaiEntry = await this.nilaiRepository.save({
          ...newNilai,
          id: existingNilai.id,
        });
        return {
          status: 'Success',
          message : ujianResponse. message,
          data: {

            soal: this.filterSoal(ujianData),
            ujian: nilaiEntry,
            nama_ujian: ujianData.nama_ujian,
            nama_mapel: ujianData.nama_mapel,
            deskripsi: ujianData.deskripsi,
            is_open_book: Number(ujianData.is_open) === 1 ? true : false,
            sisa_waktu_detik: durasiTotalMenit * 60, // Sisa waktu awal dalam detik
          },
        };
      }

      const waktuMulai = existingNilai.waktu_mulai.getTime();
      const waktuSekarang = new Date().getTime();

      let sisaWaktuMillis = durasiTotalMillis - (waktuSekarang - waktuMulai);

      const sisaWaktuDetik = Math.floor(sisaWaktuMillis / 1000);

      existingNilai.sisa_waktu = sisaWaktuDetik;

      return {
        status: 'Success',
         message : ujianResponse. message,
        data: {
          id: existingNilai.id,
          soal: this.filterSoal(ujianData),
          ujian: existingNilai,
          nama_ujian: ujianData.nama_ujian,
          nama_mapel: ujianData.nama_mapel,
          deskripsi: ujianData.deskripsi,
          is_open_book: Number(ujianData.is_open) === 1 ? true : false,
          history_nilai: existingNilai.history_nilai,
          sisa_waktu_detik: sisaWaktuDetik,
          waktu_selesai_seharusnya: new Date(waktuMulai + durasiTotalMillis),
        },
      };
    }

    // 3. Buat Entri Nilai Baru (jika belum pernah mengambil)
    const newNilai = this.nilaiRepository.create({
      ujian_id,
      user_id,
      waktu_mulai: new Date(),
      status_pengerjaan: 'ONGOING',

      // Inisialisasi sisa_waktu dengan durasi total dalam detik
      sisa_waktu: durasiTotalMenit * 60,
      jawaban_user: {},
    });

    // Simpan ke database
    const nilaiEntry = await this.nilaiRepository.save(newNilai);

    // 4. Filter Soal Sebelum Dikirimkan

    return {
      status: 'Success',
       message : ujianResponse. message,
      data: {
        id: nilaiEntry.id,
        soal: this.filterSoal(ujianData),
        ujian: nilaiEntry,
        nama_ujian: ujianData.nama_ujian,
        nama_mapel: ujianData.nama_mapel,
        deskripsi: ujianData.deskripsi,
        is_open_book: Number(ujianData.is_open) === 1 ? true : false,
        sisa_waktu_detik: durasiTotalMenit * 60, // Sisa waktu awal dalam detik
        waktu_selesai_seharusnya: new Date(
          nilaiEntry.waktu_mulai.getTime() + durasiTotalMillis,
        ),
      },
    };
  }

  /**
   * Menghapus kunci jawaban dan properti sensitif lainnya dari data soal.
   */
  private filterSoal(ujianData: any): any {
    if (!ujianData.soal) {
      return ujianData;
    }

    const filteredSoal = ujianData.soal.map((soal: any) => {
      return {
        pertanyaan: JSON.parse(soal.soal)['pertanyaan'],
        pilihan: JSON.parse(soal.soal)['pilihan'],
        tipe: soal.tipe,
        id: soal.id,
      };
    });

    return filteredSoal;
  }
}
