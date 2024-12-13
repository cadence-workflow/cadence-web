import { type WorkflowsFiltersValues } from '../../workflows-header/workflows-header.types';

export type Props = {
  domain: string;
  cluster: string;
  filtersValues: WorkflowsFiltersValues;
  pageSize?: number;
  isArchival?: boolean;
};
