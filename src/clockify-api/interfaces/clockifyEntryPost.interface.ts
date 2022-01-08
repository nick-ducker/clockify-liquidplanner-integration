export type ClockifyEntryPostInterface = {
  start?: string,
  billable?: boolean,
  description?: string,
  projectId?: string,
  taskId?: string,
  end?: string,
  tagIds?: string[],
  customFields?: {
      customFieldId?: string,
      timeEntryId?: string,
      value?: string
  }[]
  
}