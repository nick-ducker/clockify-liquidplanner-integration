import { Module } from '@nestjs/common';
import { ClockifyApiService } from 'src/clockify-api/clockify-api.service';
import { LiquidPlannerApiService } from 'src/liquid-planner-api/liquid-planner-api.service';
import { SundailController } from './sundail.controller';
import { SundailService } from './sundail.service';

@Module({
  controllers: [SundailController],
  providers: [SundailService, LiquidPlannerApiService, ClockifyApiService],
})
export class SundailModule {}
