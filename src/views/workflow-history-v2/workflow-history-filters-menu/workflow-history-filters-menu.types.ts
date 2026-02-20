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

export type WorkflowHistoryGroupFilterType =
  | 'DECISION'
  | 'ACTIVITY'
  | 'SIGNAL'
  | 'TIMER'
  | 'CHILDWORKFLOW'
  | 'WORKFLOW';

export type WorkflowHistoryFiltersTypeValue = {
  historyEventTypes: WorkflowHistoryGroupFilterType[] | undefined;
};

export type WorkflowHistoryGroupFilterConfig =
  // TODO @adhitya.mamallan - change this to use an array of group types
  // One filtering type maps to multiple group types
  HistoryEventGroupType | ((g: HistoryEventsGroup) => boolean);

export type WorkflowHistoryGroupFilterStatus =
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELED'
  | 'PENDING';

export type WorkflowHistoryFiltersStatusValue = {
  historyEventStatuses: WorkflowHistoryGroupFilterStatus[] | undefined;
};
