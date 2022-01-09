import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { LiquidPlannerTaskDto } from './dtos/liquidPlannerTask.dto';
import { LpUserDto } from './dtos/lpUsers.dto';
import { GetTaskOptionsInterface } from './interfaces/getTaskOptions.interface';

@Injectable()
export class LiquidPlannerApiService implements OnModuleInit {
  // PRIVATE
  private readonly logger = new Logger(LiquidPlannerApiService.name)
  private _client: AxiosInstance;
  private lpUsers: Record<string, number> = {}
  
  // On Module Init
  async onModuleInit(): Promise<void> {
    try {
      let users: LpUserDto[]
      const { data } = await this.client.get('members')
      users = data
      users.forEach(user =>{
        if(!user.is_virtual && user.id > 0) {
          this.lpUsers[`${user.first_name} ${user.last_name}`] = user.id
        }
      })
      this.logger.debug(`Pulled ${Object.keys(this.lpUsers).length} current LP users`)
    } catch (e) {
      this.logger.error('Unable to fetch LP users, terminating application');
      this.logger.error(e);
      process.exit(1)
    }
  }

  // GETTERS
  get client(): AxiosInstance {
    if (!this._client) {
      this._client = axios.create({
        baseURL: this.apiBase,
        headers: this.apiHeaders,
      });
    }
    return this._client;
  }

  get apiBase(): string {
    return `https://app.liquidplanner.com/api/v1/workspaces/${this.workspace}`;
  }

  get apiHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${process.env.LP_API_KEY}`,
    };
  }

  get workspace(): number {
    return 192004; // Atomix
  }

  get lpUserNameToId(): Record<string, number> {
    return this.lpUsers
  }

  // PUBLIC
  public async getTasks(
    options?: GetTaskOptionsInterface,
  ): Promise<LiquidPlannerTaskDto[]> {
    let tasks: LiquidPlannerTaskDto[];
    let filterString = '';
    if (options) {
      options.filters.forEach((e, i) => {
        filterString += `${i > 0 ? '&' : '?'}filter=${e.filter} ${e.operator} ${
          e.term
        }`;
      });
    }
    const { data } = await this.client.get(`tasks${filterString}`);
    tasks = data;

    if (!tasks) {
      let optionsString = '';
      if (options) {
        optionsString = ` with filters: ${JSON.stringify(options)}`;
      }
      throw new Error(`Failed to get tasks${optionsString}`);
    }

    return tasks;
  }

  public async logTimeAgainstTask(
    task_id: number,
    workObj: {
      activity_id: number;
      work: number;
    },
  ): Promise<void> {
    await this.client.post(`tasks/${task_id}/track_time?append=true`, {
      ...workObj,
    });
    this.logger.debug(`Lp Task ${task_id} updated`);
  }
}
