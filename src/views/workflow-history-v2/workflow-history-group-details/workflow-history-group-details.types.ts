import { type EventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';

export type GroupDetails = Record<
  string,
  {
    eventDetails: EventDetailsEntries;
    eventLabel: string;
  }
>;
