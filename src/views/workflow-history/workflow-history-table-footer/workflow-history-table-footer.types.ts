import type { RequestError } from '@/utils/request/request-error';

export type Props = {
  error: RequestError | null;
  noEventsToDisplay: boolean;
  canFetchMoreEvents: boolean;
  fetchMoreEvents: () => void;
  isFetchingMoreEvents: boolean;
};
