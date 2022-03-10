import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ClockifyTimerStoppedDto } from './dtos/clockifyEntryDto.dto';
import { ClockifyEntryPostInterface } from './interfaces/clockifyEntryPost.interface';
@Injectable()
export class ClockifyApiService {
  private readonly logger = new Logger(ClockifyApiService.name);

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
    return `https://api.clockify.me/api/v1/workspaces/${this.workspace}`;
  }

  get apiHeaders(): Record<string, string> {
    return {
      'X-Api-Key': `${process.env.CLOCKIFY_API_KEY}`,
    };
  }

  get workspace(): string {
    return '61d9268abea8275e24508cf3'; // Atomix
  }

  get getActivityId() {
    return {
      '61d9286cbea8275e24508d87': 293194, // billable
      '61d92818bea8275e24508d62': 302244, // gifted
      '61d9281dbea8275e24508d64': 293193, // internal
      '61d9285cbea8275e24508d7d': 293196, // leave
      '61d9282fbea8275e24508d70': 308418, // mentoring
      '61d9285a8ae60b1075602c43': 306876, // pod
      '61d9289dbea8275e24508d93': 293197, // professional development
      '61d928aa8ae60b1075602c52': 293198, // regressions
      '61d928ac8ae60b1075602c57': 302215, // sales
    };
  }

  get getLoggedTagId(): string {
    return '61d9341ebea8275e245091c2';
  }

  // PUBLIC
  public async updateClockifyEntry(
    id: string,
    entry: ClockifyEntryPostInterface,
  ) {
    await this.client.put(`time-entries/${id}`, entry);
  }
}
