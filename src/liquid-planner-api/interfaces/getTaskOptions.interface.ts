export interface GetTaskOptionsInterface {
  filters: Filter[];
}

type Filter = {
  filter: 'name';
  operator: 'contains';
  term: string;
};
