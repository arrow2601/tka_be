import { Test, TestingModule } from '@nestjs/testing';
import { MapelProgressService } from './mapel_progress.service';

describe('MapelProgressService', () => {
  let service: MapelProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapelProgressService],
    }).compile();

    service = module.get<MapelProgressService>(MapelProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
