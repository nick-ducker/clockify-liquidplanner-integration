import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SundailModule } from './sundail/sundail.module';
import { ClockifyApiModule } from './clockify-api/clockify-api.module';
import { LiquidPlannerApiModule } from './liquid-planner-api/liquid-planner-api.module';
import { SentryModule } from '@ntegral/nestjs-sentry';

@Module({
  imports: [
    SundailModule, 
    ClockifyApiModule, 
    LiquidPlannerApiModule,
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: process.env.NODE_ENV === 'production',
      environment: process.env.NODE_ENV,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
