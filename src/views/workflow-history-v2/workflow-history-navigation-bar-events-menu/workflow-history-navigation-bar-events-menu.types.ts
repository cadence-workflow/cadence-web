import { type WorkflowHistoryEventFilteringType } from '@/views/workflow-history/workflow-history-filters-type/workflow-history-filters-type.types';

export type Props = {
  children: React.ReactNode;
  isUngroupedHistoryView: boolean;
  menuItems: Array<NavigationBarEventsMenuItem>;
  onClickEvent: (eventId: string) => void;
};

export type NavigationBarEventsMenuItem = {
  type: WorkflowHistoryEventFilteringType;
  eventId: string;
  label: string;
};
