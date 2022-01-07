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
}
