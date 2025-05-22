import { type TileProps } from 'baseui/tile';

import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

import { type HistoryEventsGroup } from '../workflow-history.types';

export type Props = Pick<
  HistoryEventsGroup,
  | 'events'
  | 'label'
  | 'hasMissingEvents'
  | 'status'
  | 'badges'
  | 'resetToDecisionEventId'
  | 'startTimeMs'
  | 'closeTimeMs'
> & {
  statusReady: boolean;
  showLabelPlaceholder?: boolean;
  onClick: TileProps['onClick'];
  selected?: boolean;
  disabled?: boolean;
  workflowIsArchived: boolean;
  workflowCloseTimeMs?: number | null;
  workflowCloseStatus?: WorkflowExecutionCloseStatus | null;
};
