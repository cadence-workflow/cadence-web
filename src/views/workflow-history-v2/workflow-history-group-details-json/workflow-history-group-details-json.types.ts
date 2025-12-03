import { type WorkflowHistoryEventDetailsValueComponentProps } from '@/views/workflow-history/workflow-history-event-details/workflow-history-event-details.types';

export type Props = Pick<
  WorkflowHistoryEventDetailsValueComponentProps,
  'entryPath' | 'entryValue' | 'isNegative'
>;
