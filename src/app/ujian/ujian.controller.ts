import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { UjianService } from './ujian.service';
import { JwtGuard } from '../auth/auth.guard';
import { CreateUjianDto, UpdateUjianDto } from './create-ujian.dto';
import { Pagination } from 'src/utils/pagination.decorator';
import { BaseRoleController } from 'src/common/base/base-role.controller';
import { Roles } from 'src/utils/roles.decorator';

@Controller('ujian')
export class UjianController extends BaseRoleController {
  constructor(private readonly ujianService: UjianService) {
    super();
  }

  @Post('create')
  async create(@Body() dto: CreateUjianDto, @Req() req) {
    return this.ujianService.create(dto, req.user);
  }

  @Put('update')
  async update(@Body() dto: UpdateUjianDto, @Req() req) {
    return this.ujianService.updateSync(dto, req.user);
  }

  @Get('detail/:id')
  async detail(@Param('id') id: string) {
    return this.ujianService.findOne(id);
  }

  @Put('delete/:id')
  async removeSoalFromUjian(
    @Param('id') id: string,
    @Body()
    payload: {
      soalIds: string[];
      id_soal: string;
    },
  ) {
    return this.ujianService.removeSoalFromUjian(
      id,
      payload.soalIds,
      payload.id_soal,
    );
  }

  @Get('list')
  async list(@Pagination() query: any) {
    return this.ujianService.findAllPaginated(query);
  }

  @Put('add-soal/:id')
  async addSoalToUjian(
    @Param('id') id: string,
    @Body()
    payload: {
      soal: string[];
      soals: any[];
    },
  ) {
    return this.ujianService.updateBylistSoal(id, payload.soal, payload.soals);
  }
}
