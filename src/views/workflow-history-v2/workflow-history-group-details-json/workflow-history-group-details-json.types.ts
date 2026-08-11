import { type EventDetailsValueComponentProps } from '@/views/workflow-history-v2/workflow-history-event-details/workflow-history-event-details.types';

export type Props = Pick<
  EventDetailsValueComponentProps,
  'entryPath' | 'entryValue' | 'isNegative'
>;
