import { type PageQueryParamMultiValue } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { WORKFLOW_EVENT_STATUS } from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge.constants';
import { type WorkflowEventStatus } from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.constants';
import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

const workflowPageQueryParamsConfig: [
  PageQueryParamMultiValue<
    'historyEventTypes',
    WorkflowHistoryEventFilteringType[] | undefined
  >,
  PageQueryParamMultiValue<
    'historyEventStatuses',
    WorkflowEventStatus[] | undefined
  >,
] = [
  {
    key: 'historyEventTypes',
    queryParamKey: 'ht',
    isMultiValue: true,
    parseValue: (v) => {
      if (
        v.every((t) =>
          WORKFLOW_HISTORY_EVENT_FILTERING_TYPES.includes(
            t as WorkflowHistoryEventFilteringType
          )
        )
      ) {
        return v as WorkflowHistoryEventFilteringType[];
      }
      return undefined;
    },
  },
  {
    key: 'historyEventStatuses',
    queryParamKey: 'hs',
    isMultiValue: true,
    parseValue: (v) => {
      if (v.every((s) => s in WORKFLOW_EVENT_STATUS)) {
        return v as WorkflowEventStatus[];
      }
      return undefined;
    },
  },
] as const;

export default workflowPageQueryParamsConfig;
