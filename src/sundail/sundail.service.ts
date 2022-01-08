import { Injectable } from '@nestjs/common';
import { ClockifyApiService } from 'src/clockify-api/clockify-api.service';
import { LiquidPlannerApiService } from 'src/liquid-planner-api/liquid-planner-api.service';
import { ClockifyTimerStoppedDto, ClockifyTimerStoppedTimeInvervalDto } from '../clockify-api/dtos/clockifyEntryDto.dto';

@Injectable()
export class SundailService {
  constructor(
    private readonly lp: LiquidPlannerApiService,
    private readonly clockify: ClockifyApiService
  ) {}

  // PRIVATE FUNCTIONS
  private calculateTimeDecimal(timeInterval: ClockifyTimerStoppedTimeInvervalDto) {
    const startDate = new Date(`${timeInterval.start}`)
    const endDate = new Date(`${timeInterval.end}`)
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000
    const decimalHours = (seconds / 3600)

    return decimalHours
  }

  // PUBLIC FUNCTIONS
  public checkTimerEvent(description: string): string {
    const regexPattern = /(?<=\{)(.*?)(?=\})/
    const match = description.match(regexPattern);
    if (match) {
      return match[0];
    }
    return ''
  }

  public async determineLpEntityId(lpFlag: string): Promise<number> {
    const flagLength = lpFlag.split('').length
    let lpId: number
    if(flagLength <= 5) {
      console.log('Zoho ticket ID detected')
      console.log(`Searching LP using naming convention "ZOHO-${lpFlag}"`)

      const tasks = await this.lp.getTasks({
        filters: [{
          filter: 'name',
          operator: 'contains',
          term: `ZOHO-${lpFlag}`
        }]
      })

      if(tasks.length > 1) {
        throw new Error('Multiple results returned for search, aborting')
      }

      lpId = tasks[0].id
    } else {
      console.log('LP Task ID detected')
      lpId = Number(lpFlag)
    }

    return lpId
  }

  public async updateLpEntity(
    lpId: number, 
    event: ClockifyTimerStoppedDto
  ): Promise<void>{
    const duration = this.calculateTimeDecimal(event.timeInterval)
    // TEST THAT IT WILL FAIL WITHOUT AN ACTIVITY ID
    let activityId = 293194 //Billable Activity Default
    if(event.tags.length > 0) {
      activityId = this.clockify.getActivityId[event.tags[0]]
    }
    

    //TODO: Update this task to take a user ID
    await this.lp.logTimeAgainstTask(
      lpId, {
        activity_id: activityId,
        work: duration
      }
    )
  }

  public async updateClockifyEntryWithLoggedTag(
    event: ClockifyTimerStoppedDto
  ): Promise<void>{
    const loggedTagId = this.clockify.getLoggedTagId

    await this.clockify.updateClockifyEntry(event.id, {
      tagIds: [...event.tags, loggedTagId]
    })
  }
}
