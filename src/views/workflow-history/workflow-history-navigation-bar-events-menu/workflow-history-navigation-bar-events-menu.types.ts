import { type EventGroupCategory } from '../workflow-history-filters-menu/workflow-history-filters-menu.types';

export type Props = {
  children: React.ReactNode;
  isUngroupedHistoryView: boolean;
  menuItems: Array<NavigationBarEventsMenuItem>;
  /** Scroll/expand key: persisted eventId or pending computedEventId. */
  onClickEvent: (eventId: string) => void;
  onClickSubItem?: (subItem: NavigationBarEventsSubMenuItem) => void;
  subItemIcon?: React.ReactNode;
};

export type NavigationBarEventsMenuItem = {
  category: EventGroupCategory;
  /** Persisted eventId, or pending computedEventId when the group has none. */
  eventId: string;
  label: string;
  subItems?: Array<NavigationBarEventsSubMenuItem>;
};

export type NavigationBarEventsSubMenuItem = {
  id: string;
  /** Persisted eventId, or pending computedEventId when the group has none. */
  eventId: string;
  label: string;
};
