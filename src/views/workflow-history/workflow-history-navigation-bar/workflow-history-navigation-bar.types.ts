import { type NavigationBarEventsMenuItem } from '../workflow-history-navigation-bar-events-menu/workflow-history-navigation-bar-events-menu.types';

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
