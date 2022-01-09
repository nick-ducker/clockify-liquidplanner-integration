import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ClockifyApiService } from 'src/clockify-api/clockify-api.service';
import { ClockifyTimerStoppedDto } from '../clockify-api/dtos/clockifyEntryDto.dto';
import { SundailService } from './sundail.service';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Controller('sundail')
export class SundailController {
  constructor(
    private readonly sundailService: SundailService,
    private readonly clockify: ClockifyApiService,
    @InjectSentry() private readonly sentry: SentryService
  ) {}
  private readonly logger = new Logger(SundailController.name);
  
  @Post('/clockify-timer-stopped')
  async processEntry(
    @Body() clockifyTimerStoppedDto: ClockifyTimerStoppedDto,
  ): Promise<void> {
    try {
      if (clockifyTimerStoppedDto.tags.length > 0) {
        const mappedIds = clockifyTimerStoppedDto.tags.map((tag) => tag.id);
        const loggedTagIndex = mappedIds.indexOf(this.clockify.getLoggedTagId);
        if (loggedTagIndex >= 0) {
          this.logger.debug('removing logged tag from unlogged entry');
          await this.sundailService.modifyClockifyEntryLoggedTag(
            clockifyTimerStoppedDto,
            false,
          );
          clockifyTimerStoppedDto.tags.splice(loggedTagIndex, 1);
        }
      }

      this.logger.debug('checking entry description for LP flags');
      const lpFlag = this.sundailService.checkTimerEvent(
        clockifyTimerStoppedDto.description,
      );

      if (lpFlag) {
        this.logger.debug('Determining LP entity ID');
        const lpId = await this.sundailService.determineLpEntityId(lpFlag);

        this.logger.debug('Updating LP entry');
        await this.sundailService.updateLpEntity(lpId, clockifyTimerStoppedDto);

        this.logger.debug('Updating Clockify entry');
        await this.sundailService.modifyClockifyEntryLoggedTag(
          clockifyTimerStoppedDto,
        );
      }
    } catch (e) {
      this.logger.error(e);
      this.sentry.instance().captureException(e)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: String(e),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.logger.debug('Done');
    }
  }
}
