import { Injectable, Logger } from '@nestjs/common';
import { ClockifyApiService } from 'src/clockify-api/clockify-api.service';
import { LiquidPlannerApiService } from 'src/liquid-planner-api/liquid-planner-api.service';
import {
  ClockifyTimerStoppedDto,
  ClockifyTimerStoppedTimeInvervalDto,
} from '../clockify-api/dtos/clockifyEntryDto.dto';

@Injectable()
export class SundailService {
  constructor(
    private readonly lp: LiquidPlannerApiService,
    private readonly clockify: ClockifyApiService,
  ) {}
  private readonly logger = new Logger(SundailService.name);

  // PRIVATE FUNCTIONS
  private calculateTimeDecimal(
    timeInterval: ClockifyTimerStoppedTimeInvervalDto,
  ) {
    const startDate = new Date(`${timeInterval.start}`);
    const endDate = new Date(`${timeInterval.end}`);
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    const decimalHours = seconds / 3600;

    return decimalHours;
  }

  // PUBLIC FUNCTIONS
  public checkTimerEvent(description: string): string {
    // Check for {NUMBER} first
    const curlyRegex = /(?<=\{)(.*?)(?=\})/;
    const curlyMatch = description.match(curlyRegex);
    if (curlyMatch) {
      return curlyMatch[0];
    }

    // Check for #NUMBER second
    const hashRegex = /(?<=#)[0-9]*/;
    const hashMatch = description.match(hashRegex);
    if (hashMatch) {
      return hashMatch[0];
    }
    return '';
  }

  public async determineLpEntityId(lpFlag: string): Promise<number> {
    const flagLength = lpFlag.split('').length;
    let lpId: number;
    if (flagLength <= 5) {
      this.logger.debug('Zoho ticket ID detected');
      this.logger.debug(
        `Searching LP using naming convention "ZOHO-${lpFlag}"`,
      );

      const tasks = await this.lp.getTasks({
        filters: [
          {
            filter: 'name',
            operator: 'contains',
            term: `ZOHO-${lpFlag}`,
          },
        ],
      });

      if (tasks.length > 1) {
        throw new Error('Multiple results returned for search, aborting');
      }

      lpId = tasks[0].id;
    } else {
      this.logger.debug('LP Task ID detected');
      lpId = Number(lpFlag);
    }

    return lpId;
  }

  public async updateLpEntity(
    lpId: number,
    event: ClockifyTimerStoppedDto,
  ): Promise<void> {
    const lpUserId = this.lp.lpUserNameToId[event.user.name];
    if (!lpUserId) {
      throw new Error(
        `Could not resolve clockify user name ${event.user.name} to LP id`,
      );
    }
    const duration = this.calculateTimeDecimal(event.timeInterval);
    let activityId = 293194; //Billable Activity Default
    if (event.tags.length === 1) {
      activityId = this.clockify.getActivityId[event.tags[0].id];
    }
    //TODO: Update this task to take a user ID
    await this.lp.logTimeAgainstTask(lpId, {
      member_id: lpUserId,
      activity_id: activityId,
      work: duration,
    });
  }

  public async modifyClockifyEntryLoggedTag(
    event: ClockifyTimerStoppedDto,
    add: boolean = true,
  ): Promise<void> {
    const loggedTagId = this.clockify.getLoggedTagId;
    let tagIdsArr = event.tags.map((tag) => tag.id);
    if (add) {
      tagIdsArr.push(loggedTagId);
    } else {
      tagIdsArr.splice(tagIdsArr.indexOf(loggedTagId), 1);
    }

    await this.clockify.updateClockifyEntry(event.id, {
      start: event.timeInterval.start,
      billable: event.billable,
      description: event.description,
      projectId: event.project,
      taskId: event.task,
      end: event.timeInterval.end,
      tagIds: tagIdsArr,
      customFields: event.customFieldValues,
    });
  }
}
