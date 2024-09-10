import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';

export type Props = {
  status: WorkflowEventStatus;
  label: string;
  secondaryLabel: string;
  showLabelPlaceholder?: boolean;
};
