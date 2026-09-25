import {
  type NavigationBarEventsMenuItem,
  type NavigationBarEventsSubMenuItem,
} from '../workflow-history-navigation-bar-events-menu/workflow-history-navigation-bar-events-menu.types';

export type Props = {
  onScrollUp: () => void;
  onScrollDown: () => void;
  areAllItemsExpanded: boolean;
  onToggleAllItemsExpanded: () => void;
  isUngroupedView: boolean;
  failedEventsMenuItems: Array<NavigationBarEventsMenuItem>;
  pendingEventsMenuItems: Array<NavigationBarEventsMenuItem>;
  diagnosticsMenuItems: Array<NavigationBarEventsMenuItem>;
  onClickEvent: (eventId: string) => void;
  onClickDiagnosticsIssue: (subItem: NavigationBarEventsSubMenuItem) => void;
};
