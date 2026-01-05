import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import getEventGroupFilteringType from '../workflow-history-event-group/helpers/get-event-group-filtering-type';
import { type NavigationBarEventsMenuItem } from '../workflow-history-navigation-bar-events-menu/workflow-history-navigation-bar-events-menu.types';
import { type EventGroupEntry } from '../workflow-history-v2.types';

export default function getNavigationBarEventsMenuItems(
  eventGroupsEntries: Array<EventGroupEntry>,
  filterFn: (group: HistoryEventsGroup) => boolean
): Array<NavigationBarEventsMenuItem> {
  return eventGroupsEntries.reduce<Array<NavigationBarEventsMenuItem>>(
    (acc, [_, group]) => {
      const lastEventId = group.events.at(-1)?.eventId;
      if (!lastEventId) return acc;

      if (!filterFn(group)) return acc;

      acc.push({
        eventId: lastEventId,
        label: group.shortLabel ?? group.label,
        type: getEventGroupFilteringType(group),
      });

      return acc;
    },
    []
  );
}
