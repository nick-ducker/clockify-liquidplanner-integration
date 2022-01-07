import { Test, TestingModule } from '@nestjs/testing';
import { LiquidPlannerApiService } from './liquid-planner-api.service';

describe('LiquidPlannerApiService', () => {
  let service: LiquidPlannerApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiquidPlannerApiService],
    }).compile();

    service = module.get<LiquidPlannerApiService>(LiquidPlannerApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
