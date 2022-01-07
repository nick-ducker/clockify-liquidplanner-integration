import { Test, TestingModule } from '@nestjs/testing';
import { ClockifyApiService } from './clockify-api.service';

describe('ClockifyApiService', () => {
  let service: ClockifyApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClockifyApiService],
    }).compile();

    service = module.get<ClockifyApiService>(ClockifyApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
