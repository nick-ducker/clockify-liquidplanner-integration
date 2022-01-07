import { Test, TestingModule } from '@nestjs/testing';
import { SundailService } from './sundail.service';

describe('SundailService', () => {
  let service: SundailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SundailService],
    }).compile();

    service = module.get<SundailService>(SundailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
