import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import { type Props as WorkflowHistoryProps } from '../workflow-history-v2.types';

export type Props = {
  eventGroup: HistoryEventsGroup;
  getIsEventExpanded: (eventId: string) => boolean;
  toggleIsEventExpanded: (eventId: string) => void;
  showLoadingMoreEvents: boolean;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  onReset?: () => void;
  selected?: boolean;
  workflowIsArchived: boolean;
  workflowCloseStatus?: WorkflowExecutionCloseStatus | null;
  workflowCloseTimeMs?: number | null;
};
