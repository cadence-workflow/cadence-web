import { type PageQueryParam } from '@/hooks/use-page-query-params/use-page-query-params.types';
import { WORKFLOW_EVENT_STATUS } from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge.constants';
import { type WorkflowEventStatus } from '@/views/workflow-history/workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import { WORKFLOW_HISTORY_EVENT_FILTERING_TYPES } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.constants';
import { type WokflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

const workflowPageQueryParamsConfig: [
  PageQueryParam<
    'historyEventType',
    WokflowHistoryEventFilteringType | undefined
  >,
  PageQueryParam<'historyEventStatus', WorkflowEventStatus | undefined>,
] = [
  {
    key: 'historyEventType',
    queryParamKey: 'ht',
    parseValue: (v) => {
      if (
        WORKFLOW_HISTORY_EVENT_FILTERING_TYPES.includes(
          v as WokflowHistoryEventFilteringType
        )
      ) {
        return v as WokflowHistoryEventFilteringType;
      }
      return undefined;
    },
  },
  {
    key: 'historyEventStatus',
    queryParamKey: 'hs',
    parseValue: (v) => {
      if (v in WORKFLOW_EVENT_STATUS) {
        return v as WorkflowEventStatus;
      }
      return undefined;
    },
  },
] as const;

export default workflowPageQueryParamsConfig;
