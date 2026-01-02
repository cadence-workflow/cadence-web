import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

export type Props = {
  onScrollUp: () => void;
  onScrollDown: () => void;
  areAllItemsExpanded: boolean;
  onToggleAllItemsExpanded: () => void;
  isUngroupedView: boolean;
  failedEventsMenuItems: Array<NavigationBarEventsMenuItem>;
  pendingEventsMenuItems: Array<NavigationBarEventsMenuItem>;
  onClickEvent: (eventId: string) => void;
};

export type NavigationBarEventsMenuItem = {
  type: WorkflowHistoryEventFilteringType;
  eventId: string;
  label: string;
};
