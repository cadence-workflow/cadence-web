import { type GetWorkflowHistoryResponse } from '@/route-handlers/get-workflow-history/get-workflow-history.types';

export type UseKeepLoadingEventsParams = {
  keepLoading: boolean;
  resultPages: GetWorkflowHistoryResponse[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  stopAfterEndReached?: boolean;
};
