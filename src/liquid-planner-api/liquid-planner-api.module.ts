import { Module } from '@nestjs/common';
import { LiquidPlannerApiService } from './liquid-planner-api.service';

@Module({
  providers: [LiquidPlannerApiService],
})
export class LiquidPlannerApiModule {}
