import { type VirtuosoHandle } from 'react-virtuoso';

import { type EventGroupCategory } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';
import {
  type HistoryEventsGroup,
  type EventGroupEntry,
  type Props as WorkflowHistoryProps,
} from '../workflow-history-v2.types';

export type TimelineRow = {
  id: string;
  label: string;
  startTimeMs: number;
  endTimeMs: number | null;
  category: EventGroupCategory;
  status: HistoryEventsGroup['status'];
  group: HistoryEventsGroup;
};

export type Props = {
  eventGroupsEntries: Array<EventGroupEntry>;
  workflowStartTimeMs: number;
  workflowCloseTimeMs?: number | null;
  selectedEventId?: string;
  onClickShowInTable: (eventId: string) => void;
  decodedPageUrlParams: WorkflowHistoryProps['params'];
  virtuosoRef: React.RefObject<VirtuosoHandle>;
  itemToHighlightId?: string;
};
