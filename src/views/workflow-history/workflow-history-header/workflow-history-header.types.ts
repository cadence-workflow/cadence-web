import {
  type PageQueryParamSetter,
  type PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';

import type workflowPageQueryParamsConfig from '../../workflow-page/config/workflow-page-query-params.config';
import { type Props as WorkflowHistoryExportJsonButtonProps } from '../workflow-history-export-json-button/workflow-history-export-json-button.types';
import { type Props as WorkflowHistoryTimelineChartProps } from '../workflow-history-timeline-chart/workflow-history-timeline-chart.types';

type WorkflowPageQueryParamsConfig = typeof workflowPageQueryParamsConfig;
type WorkflowHistoryRequestArgs = WorkflowHistoryExportJsonButtonProps & {
  pageSize: number;
  waitForNewEvent: string;
};

type PageFiltersProps = {
  resetAllFilters: () => void;
  activeFiltersCount: number;
  queryParams: PageQueryParamValues<WorkflowPageQueryParamsConfig>;
  setQueryParams: PageQueryParamSetter<WorkflowPageQueryParamsConfig>;
};

export type Props = {
  isExpandAllEvents: boolean;
  toggleIsExpandAllEvents: () => void;
  isUngroupedHistoryViewEnabled: boolean;
  onClickGroupModeToggle: () => void;
  wfHistoryRequestArgs: WorkflowHistoryRequestArgs;
  pageFiltersProps: PageFiltersProps;
  timelineChartProps: WorkflowHistoryTimelineChartProps;
  isStickyEnabled?: boolean;
};
