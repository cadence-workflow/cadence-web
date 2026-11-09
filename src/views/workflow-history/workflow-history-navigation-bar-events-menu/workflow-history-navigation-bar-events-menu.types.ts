import { type EventGroupCategory } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

export type Props = {
  children: React.ReactNode;
  isUngroupedHistoryView: boolean;
  menuItems: Array<NavigationBarEventsMenuItem>;
  onClickEvent: (eventKey: string) => void;
  onClickSubItem?: (subItem: NavigationBarEventsSubMenuItem) => void;
  subItemIcon?: React.ReactNode;
};

export type NavigationBarEventsMenuItem = {
  category: EventGroupCategory;
  eventKey: string;
  label: string;
  subItems?: Array<NavigationBarEventsSubMenuItem>;
};

export type NavigationBarEventsSubMenuItem = {
  id: string;
  eventKey: string;
  label: string;
};
