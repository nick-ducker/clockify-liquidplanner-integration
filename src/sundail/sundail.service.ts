import { Injectable } from '@nestjs/common';
import { ClockifyTimerStoppedDto, ClockifyTimerStoppedTimeInvervalDto } from './dtos/clockifyEntryDto.dto';

@Injectable()
export class SundailService {

  // PRIVATE FUNCTIONS
  private getActivityId() {
    return {
      'gifted': '302244', 
      'internal': '293193', 
      'leave':'293196', 
      'mentoring':'308418', 
      'pod':'306876', 
      'professional development':'293197', 
      'regressions':'293198',
      'sales':'302215',
    }
  }

  private calculateTimeDecimal(timeInterval: ClockifyTimerStoppedTimeInvervalDto) {
    const startDate = new Date(`${timeInterval.start}`)
    const endDate = new Date(`${timeInterval.start}`)
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000
    const decimalHours = (seconds / 3600).toFixed(2)

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

  public async determineLpEntityId(lpFlag: string): Promise<string> {
    const flagLength = lpFlag.split('').length
    if(flagLength <= 5) {
      console.log('Zoho ticket ID detected')
      console.log('Searching LP using naming convention "ZOHO-${lpFlag}')

      const { data } = await this.lp.getTasks({
        filters: [{
          filter: 'name',
          operator: 'contains',
          term: `ZOHO-${lpFlag}`
        }]
      })
      return data.id
    }
  }

  public async updateLpEntity(
    lpId: string, 
    event: ClockifyTimerStoppedDto
  ): Promise<void>{
    const duration = this.calculateTimeDecimal(event.timeInterval)
    let activityId = '293194' //Billable Activity
    if(event.tags.length > 0) {
      activityId = this.getActivityId()[event.tags[0]]
    }
    
    await this.lp.logTimeAgainstTask({
      task_id: lpId,
      activity_id: activityId,
      work: duration
    })
  }
}
