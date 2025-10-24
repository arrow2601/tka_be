import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Mapel } from 'src/app/mapel/mapel.entity';
import { Materi } from 'src/app/materi/materi.entity';
import { seedMapelMateri } from "./mapel-materi.seeder"
config(); // baca file .env

// ✅ Buat koneksi manual, tanpa NestFactory
const AppDataSource = new DataSource({
  type: 'mysql', // ganti jika kamu pakai mysql/sqlite
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'tka_db',
  entities: [Mapel, Materi],
  synchronize: false,
  logging: false,
});

async function runSeeder() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected!');

    await seedMapelMateri(AppDataSource);

    console.log('🌱 Seeder selesai!');
  } catch (err) {
    console.error('❌ Seeder gagal:', err);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeder();
