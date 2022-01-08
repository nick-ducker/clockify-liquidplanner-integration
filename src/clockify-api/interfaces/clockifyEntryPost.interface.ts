import { ClockifyTimerStoppedCustomFieldsDto } from "../dtos/clockifyEntryDto.dto";

export type ClockifyEntryPostInterface = {
  start: string,
  billable: boolean,
  description: string,
  projectId: string | null,
  taskId: string | null,
  end: string,
  tagIds: string[],
  customFields: ClockifyTimerStoppedCustomFieldsDto[]
}