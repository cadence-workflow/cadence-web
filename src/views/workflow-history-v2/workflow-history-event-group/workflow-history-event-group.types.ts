import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import { type Props as WorkflowHistoryProps } from '../workflow-history-v2.types';

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
  | 'expectedEndTimeInfo'
  | 'shortLabel'
> & {
  isLastEvent: boolean;
  showLoadingMoreEvents: boolean;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  onReset?: () => void;
  selected?: boolean;
  workflowIsArchived: boolean;
  workflowCloseStatus?: WorkflowExecutionCloseStatus | null;
  workflowCloseTimeMs?: number | null;
};
