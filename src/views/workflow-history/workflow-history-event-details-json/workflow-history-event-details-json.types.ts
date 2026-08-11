import { type EventDetailsValueComponentProps } from '../workflow-history-event-details/workflow-history-event-details.types';

export type Props = Pick<
  EventDetailsValueComponentProps,
  'entryValue' | 'isNegative'
>;
