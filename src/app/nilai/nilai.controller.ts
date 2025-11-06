// src/ujian/ujian.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NilaiService } from './nilai.service';
import { Throttle } from '@nestjs/throttler';
import { JwtGuard } from '../auth/auth.guard';

@Controller('nilai')
export class NilaiController {
  constructor(
    private readonly nilaiService: NilaiService, // Inject NilaiService
  ) {}

  //   @Throttle({ default: { limit: 2, ttl: 10000 } })

  @UseGuards(JwtGuard)
  @Get('publish/:id/start')
  async startUjian(@Param('id') ujianId: string, @Req() req: any) {
    const user_id = req.user.id; // Ganti dengan cara Anda mendapatkan ID user

    return this.nilaiService.startUjian({
      ujian_id: ujianId,
      user_id: user_id,
    });
  }

  @UseGuards(JwtGuard)
  @Put('exam/progress')
  async progress(
    @Body('nilai_id') nilai_id: string,
    @Body('jawaban') jawaban: any,
  ) {
    return this.nilaiService.saveProgress(nilai_id, jawaban);
  }

  @UseGuards(JwtGuard)
  @Put('exam/submit')
  async submit(
    @Body('ujian_id') ujian_id: string,
    @Body('history_nilai') history_nilai: string,
    @Body('nilai_id') nilai_id: string,
    @Body('jawaban') jawaban: any,
  ) {
    return this.nilaiService.saveSubmit(
      ujian_id,
      nilai_id,
      jawaban,
      history_nilai,
    );
  }

  @Get('exam/done')
  @UseGuards(JwtGuard)
  async getNilaiSiswa() {
    return this.nilaiService.getNilaiSiswa();
  }

  // ... metode lain
}
