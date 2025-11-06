import { Test, TestingModule } from '@nestjs/testing';
import { GamifikasiService } from './gamifikasi.service';

describe('GamifikasiService', () => {
  let service: GamifikasiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamifikasiService],
    }).compile();

    service = module.get<GamifikasiService>(GamifikasiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
