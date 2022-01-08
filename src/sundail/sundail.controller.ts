import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ClockifyApiService } from 'src/clockify-api/clockify-api.service';
import { ClockifyTimerStoppedDto } from '../clockify-api/dtos/clockifyEntryDto.dto';
import { SundailService } from './sundail.service';

@Controller('sundail')
export class SundailController {
  constructor(
    private readonly sundailService: SundailService,
    private readonly clockify: ClockifyApiService,
  ) {}

  @Post('/clockify-timer-stopped')
  async processEntry(
    @Body() clockifyTimerStoppedDto: ClockifyTimerStoppedDto,
  ): Promise<void> {
    try {
      if (clockifyTimerStoppedDto.tags.length > 0) {
        const mappedIds = clockifyTimerStoppedDto.tags.map((tag) => tag.id);
        const loggedTagIndex = mappedIds.indexOf(this.clockify.getLoggedTagId);
        if (loggedTagIndex >= 0) {
          console.log('removing logged tag from unlogged entry');
          await this.sundailService.modifyClockifyEntryLoggedTag(
            clockifyTimerStoppedDto,
            false,
          );
          clockifyTimerStoppedDto.tags.splice(loggedTagIndex, 1);
        }
      }

      console.log('checking entry description for LP flags');
      const lpFlag = this.sundailService.checkTimerEvent(
        clockifyTimerStoppedDto.description,
      );

      if (lpFlag) {
        console.log('Determining LP entity ID');
        const lpId = await this.sundailService.determineLpEntityId(lpFlag);

        console.log('Updating LP entry');
        await this.sundailService.updateLpEntity(lpId, clockifyTimerStoppedDto);

        console.log('Updating Clockify entry');
        await this.sundailService.modifyClockifyEntryLoggedTag(
          clockifyTimerStoppedDto,
        );
      }
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: String(e),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      console.log('Done');
    }
  }
}
