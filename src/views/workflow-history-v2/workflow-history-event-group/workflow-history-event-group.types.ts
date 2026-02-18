import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

import {
  type HistoryEventsGroup,
  type Props as WorkflowHistoryProps,
} from '../workflow-history-v2.types';

export type Props = {
  // Core data props
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  eventGroup: HistoryEventsGroup;
  workflowCloseStatus?: WorkflowExecutionCloseStatus | null;
  workflowCloseTimeMs?: number | null;
  workflowIsArchived: boolean;

  // Expansion state
  getIsEventExpanded: (eventId: string) => boolean;
  toggleIsEventExpanded: (eventId: string) => void;
  selectedEventId?: string;

  // UI behavior
  onReset?: () => void;
  showLoadingMoreEvents: boolean;
  onClickShowInTimeline: () => void;
};
