// src/nilai/dto/create-nilai.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateNilaiDto {
  @IsUUID()
  @IsNotEmpty()
  ujian_id: string;

  // Asumsi user_id akan diambil dari token/session
  // Tapi tetap didefinisikan untuk kejelasan
  @IsUUID()
  @IsNotEmpty()
  user_id: string; 
}

export class jawabanDto {
  [soalId: string]:
    | string // Untuk PG (single choice) - contoh: "A"
    | string[] // Untuk MCMA (multiple choice) - contoh: ["A", "C"]
    | boolean[] // Untuk MTF (true/false) - contoh: [true, false, true]
    | string; // Untuk ES (essay) - contoh: "Jawaban essay..."
}