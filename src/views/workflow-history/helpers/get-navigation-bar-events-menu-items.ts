import { type NavigationBarEventsMenuItem } from '../workflow-history-navigation-bar-events-menu/workflow-history-navigation-bar-events-menu.types';
import {
  type HistoryEventsGroup,
  type EventGroupEntry,
} from '../workflow-history.types';

import getEventGroupCategory from './get-event-group-category';

export default function getNavigationBarEventsMenuItems(
  eventGroupsEntries: Array<EventGroupEntry>,
  filterFn: (group: HistoryEventsGroup) => boolean
): Array<NavigationBarEventsMenuItem> {
  return eventGroupsEntries.reduce<Array<NavigationBarEventsMenuItem>>(
    (acc, [_, group]) => {
      const lastEventKey = group.events.at(-1)?.eventId;
      if (!lastEventKey) return acc;

      if (!filterFn(group)) return acc;

      acc.push({
        eventKey: lastEventKey,
        label: group.shortLabel ?? group.label,
        category: getEventGroupCategory(group),
      });

      return acc;
    },
    []
  );
}
