import type { RequestError } from '@/utils/request/request-error';

export type Props = {
  error: RequestError | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
};
