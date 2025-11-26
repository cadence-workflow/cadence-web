import { type RefObject } from 'react';

import { type VirtuosoHandle } from 'react-virtuoso';

import { type WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';
import { type RequestError } from '@/utils/request/request-error';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import { type Props as WorkflowHistoryV2Props } from '../workflow-history-v2.types';

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
  decodedPageUrlParams: WorkflowHistoryV2Props['params'];
  reachedEndOfAvailableHistory: boolean;
  workflowCloseStatus?: WorkflowExecutionCloseStatus | null;
  workflowIsArchived: boolean;
  workflowCloseTimeMs?: number | null;
  selectedEventId?: string;
  resetToDecisionEventId: (decisionEventId: string) => void;
  getIsEventExpanded: (eventId: string) => boolean;
  toggleIsEventExpanded: (eventId: string) => void;
  // Props to fetch more history
  error: RequestError | null;
  hasMoreEvents: boolean;
  fetchMoreEvents: () => void;
  isFetchingMoreEvents: boolean;
};
