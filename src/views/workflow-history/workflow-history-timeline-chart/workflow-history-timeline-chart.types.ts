import { type HistoryEventsGroup } from '../workflow-history.types';

export type Props = {
  eventGroupsEntries: Array<[string, HistoryEventsGroup]>;
  isLoading: boolean;
  hasMoreEvents: boolean;
  fetchMoreEvents: () => void;
  isFetchingMoreEvents: boolean;
};
