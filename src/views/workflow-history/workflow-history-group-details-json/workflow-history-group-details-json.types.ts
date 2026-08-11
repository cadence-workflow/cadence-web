import { type EventDetailsValueComponentProps } from '@/views/workflow-history/workflow-history-event-details/workflow-history-event-details.types';

export type Props = Pick<
  EventDetailsValueComponentProps,
  'entryPath' | 'entryValue' | 'isNegative'
>;
