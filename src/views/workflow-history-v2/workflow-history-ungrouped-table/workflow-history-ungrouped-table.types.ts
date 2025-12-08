import { type RefObject } from 'react';

import { type VirtuosoHandle } from 'react-virtuoso';

import { type RequestError } from '@/utils/request/request-error';
import {
  type HistoryGroupEventMetadata,
  type ExtendedHistoryEvent,
  type HistoryEventsGroup,
} from '@/views/workflow-history/workflow-history.types';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

export type Props = {
  // Data and state props
  eventGroupsById: Array<[string, HistoryEventsGroup]>;
  selectedEventId?: string;
  decodedPageUrlParams: WorkflowPageTabsParams;
  resetToDecisionEventId: (decisionEventId: string) => void;

  // React Query props
  error: RequestError | null;
  hasMoreEvents: boolean;
  isFetchingMoreEvents: boolean;
  fetchMoreEvents: () => void;

  // Event expansion state management
  getIsEventExpanded: (eventId: string) => boolean;
  toggleIsEventExpanded: (eventId: string) => void;

  // Virtualization props
  setVisibleRange: ({
    startIndex,
    endIndex,
  }: {
    startIndex: number;
    endIndex: number;
  }) => void;
  initialStartIndex?: number;
  virtuosoRef: RefObject<VirtuosoHandle>;
};

export type UngroupedEventInfo = {
  id: string;
  event: ExtendedHistoryEvent;
  eventMetadata: HistoryGroupEventMetadata;
  eventGroup: HistoryEventsGroup;
  label: string;
  shortLabel?: string;
  canReset?: boolean;
};
