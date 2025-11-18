import {
  type PageQueryParamSetter,
  type PageQueryParamValues,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import { type Props as WorkflowHistoryExportJsonButtonProps } from '@/views/workflow-history/workflow-history-export-json-button/workflow-history-export-json-button.types';

import type workflowPageQueryParamsConfig from '../../workflow-page/config/workflow-page-query-params.config';

type WorkflowPageQueryParamsConfig = typeof workflowPageQueryParamsConfig;

export type WorkflowHistoryGroupMode = 'grouped' | 'ungrouped';

type PageFiltersProps = {
  resetAllFilters: () => void;
  activeFiltersCount: number;
  queryParams: PageQueryParamValues<WorkflowPageQueryParamsConfig>;
  setQueryParams: PageQueryParamSetter<WorkflowPageQueryParamsConfig>;
};

export type Props = {
  isUngroupedHistoryViewEnabled: boolean;
  onClickGroupModeToggle: () => void;
  wfHistoryRequestArgs: WorkflowHistoryExportJsonButtonProps;
  pageFiltersProps: PageFiltersProps;
  isStickyEnabled?: boolean;
};
