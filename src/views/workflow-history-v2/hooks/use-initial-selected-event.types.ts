import { type HistoryEventsGroup } from '../workflow-history-v2.types';

export type UseInitialSelectedEventParams = {
  eventGroups: Record<string, HistoryEventsGroup>;
  selectedEventId?: string;
  filteredEventGroupsEntries: [string, HistoryEventsGroup][];
};
