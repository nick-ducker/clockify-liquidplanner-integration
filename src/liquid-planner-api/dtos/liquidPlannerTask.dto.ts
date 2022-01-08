export type LiquidPlannerTaskDto = Record<string, unknown> & {
  id: number;
  parent_id: number;
  project_id: number;
  custom_field_values: Record<string, any>;
  work: number;
  parent_crumbs: string[];
};
