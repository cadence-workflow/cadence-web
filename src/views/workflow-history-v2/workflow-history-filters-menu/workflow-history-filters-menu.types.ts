import {
  type PageQueryParamSetter,
  type PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import type workflowPageQueryParamsConfig from '@/views/workflow-page/config/workflow-page-query-params.config';

type WorkflowPageQueryParamsConfig = typeof workflowPageQueryParamsConfig;

export type Props = {
  resetAllFilters: () => void;
  activeFiltersCount: number;
  queryParams: PageQueryParamValues<WorkflowPageQueryParamsConfig>;
  setQueryParams: PageQueryParamSetter<WorkflowPageQueryParamsConfig>;
};

export type EventGroupCategory =
  | 'DECISION'
  | 'ACTIVITY'
  | 'SIGNAL'
  | 'TIMER'
  | 'CHILDWORKFLOW'
  | 'WORKFLOW';

export type EventGroupCategoryFilterValue = {
  historyEventTypes: EventGroupCategory[] | undefined;
};

export type EventGroupCategoryColors = {
  content: string;
  background: string;
  backgroundHighlighted: string;
};

export type EventGroupStatus = 'COMPLETED' | 'FAILED' | 'CANCELED' | 'PENDING';

export type EventGroupStatusFilterValue = {
  historyEventStatuses: EventGroupStatus[] | undefined;
};
