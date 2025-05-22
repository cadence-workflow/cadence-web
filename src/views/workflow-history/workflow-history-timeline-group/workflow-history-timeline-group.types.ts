import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

import {
  type GetIsEventExpanded,
  type ToggleIsEventExpanded,
} from '../hooks/use-event-expansion-toggle.types';
import type {
  HistoryEventsGroup,
  Props as WorkflowHistoryProps,
} from '../workflow-history.types';

export type Props = Pick<
  HistoryEventsGroup,
  | 'events'
  | 'eventsMetadata'
  | 'timeLabel'
  | 'label'
  | 'hasMissingEvents'
  | 'status'
  | 'badges'
  | 'resetToDecisionEventId'
  | 'startTimeMs'
  | 'closeTimeMs'
> & {
  isLastEvent: boolean;
  showLoadingMoreEvents: boolean;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  getIsEventExpanded: GetIsEventExpanded;
  onEventToggle: ToggleIsEventExpanded;
  onReset?: () => void;
  selected?: boolean;
  workflowIsArchived: boolean;
  workflowCloseStatus?: WorkflowExecutionCloseStatus | null;
  workflowCloseTimeMs?: number | null;
};
