import { type HistoryEventsGroup } from '../workflow-history.types';

export type Props = {
  eventGroupsEntries: Array<[string, HistoryEventsGroup]>;
  selectedEventId: string | null | undefined;
  isLoading: boolean;
  hasMoreEvents: boolean;
  fetchMoreEvents: () => void;
  isFetchingMoreEvents: boolean;
  onClickEventGroup: (eventGroupIndex: number) => void;
};
