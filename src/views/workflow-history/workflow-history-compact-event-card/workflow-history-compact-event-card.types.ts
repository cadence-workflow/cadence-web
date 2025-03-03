import { type TileProps } from 'baseui/tile';

import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import { type HistoryGroupBadge } from '../workflow-history.types';

export type Props = {
  status: WorkflowEventStatus;
  statusReady: boolean;
  label: string;
  secondaryLabel: string;
  showLabelPlaceholder?: boolean;
  badges?: HistoryGroupBadge[];
  onClick: TileProps['onClick'];
  selected?: boolean;
  disabled?: boolean;
};
