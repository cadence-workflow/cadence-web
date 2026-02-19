import { type VirtuosoHandle } from 'react-virtuoso';

import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

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
  groupType: WorkflowHistoryEventFilteringType;
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
