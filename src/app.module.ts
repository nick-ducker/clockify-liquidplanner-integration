import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SundailModule } from './sundail/sundail.module';
import { ClockifyApiModule } from './clockify-api/clockify-api.module';
import { LiquidPlannerApiModule } from './liquid-planner-api/liquid-planner-api.module';

@Module({
  imports: [SundailModule, ClockifyApiModule, LiquidPlannerApiModule],
  controllers: [AppController],
})
export class AppModule {}
