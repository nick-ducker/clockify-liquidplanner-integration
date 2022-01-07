export type ClockifyTimerStoppedDto = {
  id: string;
  description: string;
  billable: boolean;
  timeInterval: ClockifyTimerStoppedTimeInvervalDto
  tags: string[];
}

export type ClockifyTimerStoppedTimeInvervalDto = {
  start: string;
  end: string;
  duration: string;
}