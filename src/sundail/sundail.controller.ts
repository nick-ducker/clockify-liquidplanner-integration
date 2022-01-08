import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ClockifyTimerStoppedDto } from '../clockify-api/dtos/clockifyEntryDto.dto';
import { SundailService } from './sundail.service';

@Controller('sundail')
export class SundailController {
  constructor(
    private readonly sundailService: SundailService
  ) {}

  @Post('/clockify-timer-stopped')
  async processEntry(@Body() clockifyTimerStoppedDto: ClockifyTimerStoppedDto): Promise<void> {
    try {
      console.log("checking entry description for LP flags")
      const lpFlag = this.sundailService.checkTimerEvent(clockifyTimerStoppedDto.description)
  
      if (lpFlag) {
        console.log("Determining LP entity ID")
        const lpId = await this.sundailService.determineLpEntityId(lpFlag)

        console.log("Updating LP entry")
        await this.sundailService.updateLpEntity(lpId, clockifyTimerStoppedDto)

        console.log("Updating Clockify entry")
        await this.sundailService.updateClockifyEntryWithLoggedTag(clockifyTimerStoppedDto)
      }
    } catch (e) {
      console.log(e)
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: String(e),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      console.log('Done')
    }
  }
}
