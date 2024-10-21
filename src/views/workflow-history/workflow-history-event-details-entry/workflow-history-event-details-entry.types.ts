import {
  type WorkflowHistoryEventDetailsConfig,
  type WorkflowHistoryEventDetailsValueComponentProps,
} from '../workflow-history-event-details/workflow-history-event-details.types';

export type Props = WorkflowHistoryEventDetailsValueComponentProps & {
  renderConfig: WorkflowHistoryEventDetailsConfig | null;
};
