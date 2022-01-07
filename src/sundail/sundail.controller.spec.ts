import { Test, TestingModule } from '@nestjs/testing';
import { SundailController } from './sundail.controller';

describe('SundailController', () => {
  let controller: SundailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SundailController],
    }).compile();

    controller = module.get<SundailController>(SundailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
