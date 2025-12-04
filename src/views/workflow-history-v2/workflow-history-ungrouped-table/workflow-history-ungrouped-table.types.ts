import { type RefObject } from 'react';

import { type VirtuosoHandle } from 'react-virtuoso';

import { type RequestError } from '@/utils/request/request-error';
import {
  type ExtendedHistoryEvent,
  type HistoryEventsGroup,
  type HistoryGroupEventMetadata,
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
  label: string;
  shortLabel?: string;
  event: ExtendedHistoryEvent;
  eventMetadata: HistoryGroupEventMetadata;
  canReset?: boolean;
};

// import { type ListRange, type VirtuosoHandle } from 'react-virtuoso';

// import { type RequestError } from '@/utils/request/request-error';
// import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

// import {
//   type GetIsEventExpanded,
//   type ToggleIsEventExpanded,
// } from '../hooks/use-event-expansion-toggle.types';
// import { type WorkflowHistoryUngroupedEventInfo } from '../workflow-history-ungrouped-event/workflow-history-ungrouped-event.types';

// export type Props = {
//   // Data and state props
//   eventsInfo: Array<WorkflowHistoryUngroupedEventInfo>;
//   selectedEventId?: string;
//   decodedPageUrlParams: WorkflowPageTabsParams;
//   onResetToEventId: (eventId: string) => void;

//   // React Query props
//   error: RequestError | null;
//   hasMoreEvents: boolean;
//   isFetchingMoreEvents: boolean;
//   fetchMoreEvents: () => void;

//   // Event expansion state management
//   getIsEventExpanded: GetIsEventExpanded;
//   toggleIsEventExpanded: ToggleIsEventExpanded;

//   // Virtualization props
//   onVisibleRangeChange: (r: ListRange) => void;
//   virtuosoRef: React.RefObject<VirtuosoHandle>;
// };
