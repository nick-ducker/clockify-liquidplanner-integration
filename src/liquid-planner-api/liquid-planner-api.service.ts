import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { LiquidPlannerTaskDto } from './dtos/liquidPlannerTask.dto';
import { GetTaskOptionsInterface } from './interfaces/getTaskOptions.interface';

@Injectable()
export class LiquidPlannerApiService {
  // PRIVATE
  private _client: AxiosInstance;

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
    return `https://app.liquidplanner.com/api/v1/workspaces/${this.workspace}`
  }

  get apiHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${process.env.LP_API_KEY}`,
    }
  }

  get workspace(): number {
    return 192004 // Atomix
  }

  public async getTasks(
    options?: GetTaskOptionsInterface
  ): Promise<LiquidPlannerTaskDto[]> {
      let tasks: LiquidPlannerTaskDto[]
      let filterString = ''
      if(options){
        options.filters.forEach((e, i) => {
          filterString +=`${i > 0 ? '&' : '?'}filter=${e.filter} ${e.operator} ${e.term}`
        })
      }
      const { data } = await this.client.get(`tasks${filterString}`);
      tasks = data;

      if (!tasks) {
        let optionsString = ''
        if(options) {
          optionsString = ` with filters: ${JSON.stringify(options)}`
        }
        throw new Error(`Failed to get tasks${optionsString}`);
      }

      return tasks
  }

  public async logTimeAgainstTask(
    task_id: number,
    workObj: {
      activity_id: number,
      work: number
    }
  ): Promise<void> {
    await this.client.post(`tasks/${task_id}/track_time?append=true`, { ...workObj })
    console.log(`Lp Task ${task_id} updated`)
  }
}
