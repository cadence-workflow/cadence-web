import { type ListRange, type VirtuosoHandle } from 'react-virtuoso';

import { type RequestError } from '@/utils/request/request-error';
import { type WorkflowPageTabsParams } from '@/views/workflow-page/workflow-page-tabs/workflow-page-tabs.types';

import {
  type GetIsEventExpanded,
  type ToggleIsEventExpanded,
} from '../../workflow-history/hooks/use-event-expansion-toggle.types';
import { type HistoryEventsGroup } from '../../workflow-history/workflow-history.types';

export type Props = {
  // Data and state props
  eventGroupsEntries: Array<[string, HistoryEventsGroup]>;
  selectedEventId?: string;
  decodedPageUrlParams: WorkflowPageTabsParams;
  onResetToEventId: (eventId: string) => void;

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

  // Workflow info
  workflowCloseTimeMs?: number | null;
  workflowIsArchived: boolean;
  reachedAvailableHistoryEnd: boolean;
};
