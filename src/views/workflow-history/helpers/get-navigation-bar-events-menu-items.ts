import isPendingHistoryEvent from '../workflow-history-event-details/helpers/is-pending-history-event';
import { type NavigationBarEventsMenuItem } from '../workflow-history-navigation-bar-events-menu/workflow-history-navigation-bar-events-menu.types';
import {
  type HistoryEventsGroup,
  type EventGroupEntry,
  type ExtendedHistoryEvent,
} from '../workflow-history.types';

import getEventGroupCategory from './get-event-group-category';

export default function getNavigationBarEventsMenuItems(
  eventGroupsEntries: Array<EventGroupEntry>,
  filterFn: (group: HistoryEventsGroup) => boolean
): Array<NavigationBarEventsMenuItem> {
  return eventGroupsEntries.reduce<Array<NavigationBarEventsMenuItem>>(
    (acc, [_, group]) => {
      // Widened so isPendingHistoryEvent can narrow it; groupType narrowing
      // alone would hide pending events from the array's element type.
      const events: Array<ExtendedHistoryEvent> = group.events;
      // Decision groups: prefer a persisted event so expansion/scroll survive
      // the pending tab disappearing; fall back to the pending synthetic id
      // for pending-only groups. Other group types keep last-event targeting.
      // Next's polyfills cover at() but not findLast, so scan a reversed copy.
      const reversedEvents = [...events].reverse();
      const lastEventId =
        group.groupType === 'Decision'
          ? reversedEvents.find((e) => e.eventId)?.eventId ||
            reversedEvents.find(isPendingHistoryEvent)?.computedEventId
          : events.at(-1)?.eventId;

      if (!lastEventId) return acc;

      if (!filterFn(group)) return acc;

      acc.push({
        eventId: lastEventId,
        label: group.shortLabel ?? group.label,
        category: getEventGroupCategory(group),
      });

      return acc;
    },
    []
  );
}
