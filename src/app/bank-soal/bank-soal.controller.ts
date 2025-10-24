import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  BadRequestException,
  Put,
  Param,
  Query,
} from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { BankSoalService } from './bank-soal.service';
import { Roles } from 'src/utils/roles.decorator';
import { BaseRoleController } from 'src/common/base/base-role.controller';

@UseGuards(JwtGuard)
@Controller('bank-soal')
export class BankSoalController extends BaseRoleController {
  constructor(private readonly bankSoalService: BankSoalService) {
    super();
  }

  // 🟢 Simpan satu soal
  @Roles('guru')
  @Post('create')
  async createOne(@Body() body: any, @Req() req) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('User tidak ditemukan');

    return this.bankSoalService.createOne(body, userId);
  }

  @Roles('guru')
  @Put('update')
  async updateOne(@Body() body: any, @Req() req) {
    const userId = req.user?.id;

    return this.bankSoalService.updateOne(body, userId);
  }
  @Roles('guru')
  @Get('list')
  async findAll(@Query() query: any) {
    return this.bankSoalService.findAll(query);
  }
}
