import { type EventGroupCategory } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

export type Props = {
  children: React.ReactNode;
  isUngroupedHistoryView: boolean;
  menuItems: Array<NavigationBarEventsMenuItem>;
  onClickEvent: (eventId: string) => void;
};

export type NavigationBarEventsMenuItem = {
  category: EventGroupCategory;
  eventId: string;
  label: string;
};
