import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import compareUngroupedEvents from '../workflow-history-ungrouped-table/helpers/compare-ungrouped-events';
import { type UngroupedEventInfo } from '../workflow-history-ungrouped-table/workflow-history-ungrouped-table.types';

export function createUngroupedEventsInfo(
  eventGroupsById: Array<[string, HistoryEventsGroup]>
): Array<UngroupedEventInfo> {
  return eventGroupsById
    .map(([groupId, group]) => [
      ...group.events.map((event, index) => ({
        id: event.eventId ?? event.computedEventId,
        groupId,
        event,
        eventMetadata: group.eventsMetadata[index],
        eventGroup: group,
        label: group.label,
        shortLabel: group.shortLabel,
        canReset: group.resetToDecisionEventId === event.eventId,
      })),
    ])
    .flat(1)
    .sort(compareUngroupedEvents);
}
