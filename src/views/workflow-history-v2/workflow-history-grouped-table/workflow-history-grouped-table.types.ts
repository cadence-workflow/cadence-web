import { type RefObject } from 'react';

import { type VirtuosoHandle } from 'react-virtuoso';

import { type RequestError } from '@/utils/request/request-error';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

export type Props = {
  eventGroupsById: Array<[string, HistoryEventsGroup]>;
  virtuosoRef: RefObject<VirtuosoHandle>;
  initialStartIndex?: number;
  setVisibleRange: ({
    startIndex,
    endIndex,
  }: {
    startIndex: number;
    endIndex: number;
  }) => void;
  // Props to fetch more history
  error: RequestError | null;
  hasMoreEvents: boolean;
  fetchMoreEvents: () => void;
  isFetchingMoreEvents: boolean;
};
