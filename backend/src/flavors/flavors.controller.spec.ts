import { Test, TestingModule } from '@nestjs/testing';
import { FlavorsController } from './flavors.controller';
import { FlavorsService } from './flavors.service';

describe('FlavorsController', () => {
  let controller: FlavorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlavorsController],
      providers: [FlavorsService],
    }).compile();

    controller = module.get<FlavorsController>(FlavorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
