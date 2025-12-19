import type { RequestError } from '@/utils/request/request-error';

export type Props = {
  error: RequestError | null;
  hasMoreEvents: boolean;
  fetchMoreEvents: () => void;
  isFetchingMoreEvents: boolean;
};
