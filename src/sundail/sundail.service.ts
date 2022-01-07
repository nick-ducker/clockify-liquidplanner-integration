import { Injectable } from '@nestjs/common';

@Injectable()
export class SundailService {

  public checkTimerEvent(description: string): string {
    const regexPattern = /(?<=\{)(.*?)(?=\})/
    const match = description.match(regexPattern);
    if (match) {
      return match[0];
    }
    return ''
  }
}
