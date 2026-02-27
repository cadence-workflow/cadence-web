import { WORKFLOW_HISTORY_EVENT_GROUP_TYPE_TO_CATEGORY_MAP } from '../workflow-history-filters-menu/workflow-history-filters-menu.constants';
import { type NavigationBarEventsMenuItem } from '../workflow-history-navigation-bar-events-menu/workflow-history-navigation-bar-events-menu.types';
import {
  type HistoryEventsGroup,
  type EventGroupEntry,
} from '../workflow-history-v2.types';

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
        category:
          WORKFLOW_HISTORY_EVENT_GROUP_TYPE_TO_CATEGORY_MAP[group.groupType],
      });

      return acc;
    },
    []
  );
}
