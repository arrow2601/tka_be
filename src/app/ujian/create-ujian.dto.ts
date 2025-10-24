import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
} from 'class-validator';

export class CreateUjianDto {
  @IsNotEmpty()
  @IsString()
  nama_ujian: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @IsString()
  mapel_id?: string;
  @IsOptional()
  @IsString()
  nama_mapel?: string;

  @IsNotEmpty()
  @IsDateString()
  tanggal_mulai: string;

  @IsNotEmpty()
  @IsDateString()
  tanggal_selesai: string;

  @IsOptional()
  @IsInt()
  durasi_menit?: number;

  @IsOptional()
  @IsBoolean()
  is_published?: boolean;

  //   @IsNotEmpty()
  //   @IsInt()
  //   mapelId: number;

  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  soal?: string[];
}

export class UpdateUjianDto extends CreateUjianDto {
  @IsNotEmpty()
  id: string;

  

 @IsOptional()
  @IsBoolean()
  is_open: boolean;
}
