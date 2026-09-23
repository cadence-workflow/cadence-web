import WorkflowHistoryFiltersIssues from '../workflow-history-filters-issues/workflow-history-filters-issues';
import {
  type EventGroupIssuesFilterValue,
  type EventGroupStatusFilterValue,
  type EventGroupCategoryFilterValue,
} from '../workflow-history-filters-menu/workflow-history-filters-menu.types';
import { type WorkflowHistoryFilterConfig } from '../workflow-history.types';

import workflowHistoryFiltersConfig from './workflow-history-filters.config';

const workflowHistoryIssuesFilterConfig: WorkflowHistoryFilterConfig<EventGroupIssuesFilterValue> =
  {
    id: 'historyEventIssues',
    getValue: (v) => ({ historyEventIssues: v.historyEventIssues }),
    formatValue: (v) => ({
      historyEventIssues: v.historyEventIssues ? 'true' : undefined,
    }),
    component: WorkflowHistoryFiltersIssues,
    filterFunc: () => true,
  };

const workflowHistoryFiltersWithIssuesConfig: [
  WorkflowHistoryFilterConfig<EventGroupIssuesFilterValue>,
  WorkflowHistoryFilterConfig<EventGroupCategoryFilterValue>,
  WorkflowHistoryFilterConfig<EventGroupStatusFilterValue>,
] = [workflowHistoryIssuesFilterConfig, ...workflowHistoryFiltersConfig];

export default workflowHistoryFiltersWithIssuesConfig;
