import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SundailController } from './sundail/sundail.controller';
import { SundailService } from './sundail/sundail.service';
import { SundailModule } from './sundail/sundail.module';
import { ClockifyApiService } from './clockify-api/clockify-api.service';
import { ClockifyApiModule } from './clockify-api/clockify-api.module';
import { LiquidPlannerApiModule } from './liquid-planner-api/liquid-planner-api.module';

@Module({
  imports: [SundailModule, ClockifyApiModule, LiquidPlannerApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
