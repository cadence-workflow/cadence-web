import { type EventDetailsEntries } from '../workflow-history-event-details/workflow-history-event-details.types';

export type EventDetailsTabContent = {
  eventDetails: EventDetailsEntries;
  eventLabel: string;
};

export type GroupDetailsEntries = Array<[string, EventDetailsTabContent]>;
