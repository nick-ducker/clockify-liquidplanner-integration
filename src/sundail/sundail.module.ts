import { Module } from '@nestjs/common';
import { LiquidPlannerApiService } from 'src/liquid-planner-api/liquid-planner-api.service';
import { SundailController } from './sundail.controller';
import { SundailService } from './sundail.service';

@Module({
  controllers: [SundailController],
  providers: [SundailService, LiquidPlannerApiService]
})
export class SundailModule {}
