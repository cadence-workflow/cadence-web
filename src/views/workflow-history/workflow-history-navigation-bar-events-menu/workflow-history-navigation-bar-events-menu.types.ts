import { type EventGroupCategory } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

export type Props = {
  children: React.ReactNode;
  isUngroupedHistoryView: boolean;
  menuItems: Array<NavigationBarEventsMenuItem>;
  /** Key from getEventKey. */
  onClickEvent: (eventKey: string) => void;
  onClickSubItem?: (subItem: NavigationBarEventsSubMenuItem) => void;
  subItemIcon?: React.ReactNode;
};

export type NavigationBarEventsMenuItem = {
  category: EventGroupCategory;
  /** Key from getEventKey. */
  eventKey: string;
  label: string;
  subItems?: Array<NavigationBarEventsSubMenuItem>;
};

export type NavigationBarEventsSubMenuItem = {
  id: string;
  /** Key from getEventKey. */
  eventKey: string;
  label: string;
};
