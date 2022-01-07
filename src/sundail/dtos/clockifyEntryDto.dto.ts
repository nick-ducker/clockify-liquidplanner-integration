export type ClockifyTimerStoppedDto = {
  id: string;
  description: string;
  billable: boolean;
  timeInterval: {
    start: string;
    end: string;
    duration: string;
  }
}