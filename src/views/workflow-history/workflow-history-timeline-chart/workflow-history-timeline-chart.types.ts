import { type HistoryEventsGroup } from '../workflow-history.types';

export type Props = {
  eventGroups: Array<HistoryEventsGroup>;
  isLoading: boolean;
  hasMoreEvents: boolean;
  fetchMoreEvents: () => void;
  isFetchingMoreEvents: boolean;
};
