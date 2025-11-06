import { Test, TestingModule } from '@nestjs/testing';
import { GamifikasiController } from './gamifikasi.controller';

describe('GamifikasiController', () => {
  let controller: GamifikasiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamifikasiController],
    }).compile();

    controller = module.get<GamifikasiController>(GamifikasiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
