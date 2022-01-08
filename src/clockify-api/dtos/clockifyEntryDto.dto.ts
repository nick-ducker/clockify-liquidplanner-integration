export type ClockifyTimerStoppedDto = {
  id: string;
  description: string;
  userId: string;
  billable: boolean;
  projectId: string | null;
  timeInterval: ClockifyTimerStoppedTimeInvervalDto;
  workspaceId: string;
  isLocked: boolean;
  hourlyRate: number | null;
  costRate: number | null;
  customFieldValues: ClockifyTimerStoppedCustomFieldsDto[];
  currentlyRunning: boolean;
  project: string | null;
  task: string | null;
  user: {
    id: string;
    name: string;
    status: string;
  };
  tags: ClockifyTimerStoppedTagsDto[];
};

export type ClockifyTimerStoppedTagsDto = {
  name: string;
  workspaceId: string;
  archived: boolean;
  id: string;
};

export type ClockifyTimerStoppedCustomFieldsDto = {
  customFieldId?: string;
  timeEntryId?: string;
  value?: string;
};

export type ClockifyTimerStoppedTimeInvervalDto = {
  start: string;
  end: string;
  duration: string;
};
