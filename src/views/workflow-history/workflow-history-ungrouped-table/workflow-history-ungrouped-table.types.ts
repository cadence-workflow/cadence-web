import { type ListRange, type VirtuosoHandle } from 'react-virtuoso';

import { type RequestError } from '@/utils/request/request-error';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import {
  type GetIsEventExpanded,
  type ToggleIsEventExpanded,
} from '../hooks/use-event-expansion-toggle.types';
import { type WorkflowHistoryUngroupedEventInfo } from '../workflow-history-ungrouped-event/workflow-history-ungrouped-event.types';

export type Props = {
  // Data and state props
  eventsInfo: Array<WorkflowHistoryUngroupedEventInfo>;
  selectedEventId?: string;
  decodedPageUrlParams: WorkflowPageTabsParams;

  // React Query props
  error: RequestError | null;
  hasMoreEvents: boolean;
  isFetchingMoreEvents: boolean;
  fetchMoreEvents: () => void;

  // Event expansion state management
  getIsEventExpanded: GetIsEventExpanded;
  toggleIsEventExpanded: ToggleIsEventExpanded;

  // Virtualization props
  onVisibleRangeChange: (r: ListRange) => void;
  virtuosoRef: React.RefObject<VirtuosoHandle>;
};
