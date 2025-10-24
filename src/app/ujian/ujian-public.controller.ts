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
import { Pagination } from 'src/utils/pagination.decorator';


@Controller('ujian')
export class UjianPublicController  {
  constructor(private readonly ujianService: UjianService) {
   
  }
  
  @Get('list-publish')
  async listPublish(@Pagination() query: any) {
    return this.ujianService.findAllSiswa(query);
  }
  //  @Get('publish/:id')
  // async publish(@Param() id:string) {
  //   return this.ujianService.findOnePublic(id);
  // }


}
