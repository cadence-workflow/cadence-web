import {
  type PageQueryParamSetter,
  type PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import type workflowPageQueryParamsConfig from '@/views/workflow-page/config/workflow-page-query-params.config';

import {
  type HistoryEventGroupType,
  type HistoryEventsGroup,
} from '../workflow-history-v2.types';

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

export type EventGroupCategoryConfig =
  // TODO @adhitya.mamallan - change this to use an array of group types
  // One filtering type maps to multiple group types
  HistoryEventGroupType | ((g: HistoryEventsGroup) => boolean);

export type EventGroupStatus = 'COMPLETED' | 'FAILED' | 'CANCELED' | 'PENDING';

export type EventGroupStatusFilterValue = {
  historyEventStatuses: EventGroupStatus[] | undefined;
};
