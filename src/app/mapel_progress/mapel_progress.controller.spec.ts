import { Test, TestingModule } from '@nestjs/testing';
import { MapelProgressController } from './mapel_progress.controller';

describe('MapelProgressController', () => {
  let controller: MapelProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapelProgressController],
    }).compile();

    controller = module.get<MapelProgressController>(MapelProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
