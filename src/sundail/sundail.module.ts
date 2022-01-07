import { Module } from '@nestjs/common';
import { SundailController } from './sundail.controller';
import { SundailService } from './sundail.service';

@Module({
  controllers: [SundailController],
  providers: [SundailService]
})
export class SundailModule {}
