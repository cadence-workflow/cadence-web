import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

export type UseInitialSelectedEventParams = {
  events: HistoryEvent[];
  selectedEventId?: string;
  filteredEventGroupsEntries: [string, any][];
};
