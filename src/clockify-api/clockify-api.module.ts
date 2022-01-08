import { Module } from '@nestjs/common';
import { ClockifyApiService } from './clockify-api.service';

@Module({
  providers: [ClockifyApiService],
})
export class ClockifyApiModule {}
