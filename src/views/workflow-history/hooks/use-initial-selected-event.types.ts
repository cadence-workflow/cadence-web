import { type HistoryEventsGroup } from '../workflow-history.types';

export type UseInitialSelectedEventParams = {
  eventGroups: Record<string, HistoryEventsGroup>;
  selectedEventId?: string;
  filteredEventGroupsEntries: [string, HistoryEventsGroup][];
};
