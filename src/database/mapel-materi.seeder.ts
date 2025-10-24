import { DataSource } from 'typeorm';
import { Mapel } from 'src/app/mapel/mapel.entity';
import { Materi } from 'src/app/materi/materi.entity';

export async function seedMapelMateri(dataSource: DataSource) {
  const mapelRepo = dataSource.getRepository(Mapel);
  const materiRepo = dataSource.getRepository(Materi);

  const mapelMatematika = mapelRepo.create({
    nama_mapel: 'Matematika',
    deskripsi: 'Pelajaran dasar berhitung dan logika',
  });
  await mapelRepo.save(mapelMatematika);

  const materiList = [
    'Statistika',
    'Peluang',
    'Aljabar',
    'Geometri',
    'Trigonometri',
    'Kalkulus Dasar',
  ].map((nama) =>
    materiRepo.create({
      nama_materi: nama,
      tingkat_sekolah: 'SMA',
    }),
  );

  await materiRepo.save(materiList);

  console.log('✅ Mapel dan materi berhasil di-seed!');
}
