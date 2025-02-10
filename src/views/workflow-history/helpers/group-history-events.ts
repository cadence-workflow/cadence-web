import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import logger from '@/utils/logger';

import type {
  ExtendedActivityHistoryEvent,
  ExtendedDecisionHistoryEvent,
  HistoryEventsGroup,
  HistoryEventsGroups,
  PendingActivityTaskStartEvent,
  PendingDecisionTaskScheduleEvent,
} from '../workflow-history.types';

import isChildWorkflowExecutionEvent from './check-history-event-group/is-child-workflow-execution-event';
import isExtendedActivityEvent from './check-history-event-group/is-extended-activity-event';
import isExtendedDecisionEvent from './check-history-event-group/is-extended-decision-event';
import isRequestCancelExternalWorkflowExecutionEvent from './check-history-event-group/is-request-cancel-external-workflow-execution-event';
import isSignalExternalWorkflowExecutionEvent from './check-history-event-group/is-signal-external-workflow-execution-event';
import isSingleEvent from './check-history-event-group/is-single-event';
import isTimerEvent from './check-history-event-group/is-timer-event';
import getHistoryEventGroupId from './get-history-event-group-id';
import getActivityGroupFromEvents from './get-history-group-from-events/get-activity-group-from-events';
import getChildWorkflowExecutionGroupFromEvents from './get-history-group-from-events/get-child-workflow-execution-group-from-events';
import getDecisionGroupFromEvents from './get-history-group-from-events/get-decision-group-from-events';
import getRequestCancelExternalWorkflowExecutionGroupFromEvents from './get-history-group-from-events/get-request-cancel-external-workflow-execution-group-from-events';
import getSignalExternalWorkflowExecutionGroupFromEvents from './get-history-group-from-events/get-signal-external-workflow-execution-group-from-events';
import getSingleEventGroupFromEvents from './get-history-group-from-events/get-single-event-group-from-events';
import getTimerGroupFromEvents from './get-history-group-from-events/get-timer-group-from-events';
import placeEventInGroupEvents from './place-event-in-group-events';

export function groupHistoryEvents(
  events: HistoryEvent[],
  {
    pendingStartActivities,
    pendingScheduleDecision,
    allEvents,
  }: {
    pendingStartActivities: PendingActivityTaskStartEvent[];
    pendingScheduleDecision: PendingDecisionTaskScheduleEvent | null;
    allEvents: HistoryEvent[];
  }
) {
  const groupByFirstEventId: HistoryEventsGroups = {};
  events.forEach((event) => {
    const groupId = getHistoryEventGroupId(event);
    if (!groupId) {
      logger.warn(
        {
          eventId: event.eventId,
          eventTime: event.eventTime,
        },
        "Couldn't extract groupId from event, check event payload and extraction logic"
      );
    } else {
      const defaultGroupDetails: Partial<HistoryEventsGroup> = {
        events: [],
        hasMissingEvents: false,
        label: '',
      };
      const currentGroup = groupByFirstEventId[groupId] || defaultGroupDetails;
      const updatedEventsArr = placeEventInGroupEvents(
        event,
        currentGroup.events
      );
      if (updatedEventsArr.every(isExtendedActivityEvent)) {
        groupByFirstEventId[groupId] =
          getActivityGroupFromEvents(updatedEventsArr);
      } else if (updatedEventsArr.every(isExtendedDecisionEvent)) {
        groupByFirstEventId[groupId] =
          getDecisionGroupFromEvents(updatedEventsArr);
      } else if (updatedEventsArr.every(isTimerEvent)) {
        groupByFirstEventId[groupId] =
          getTimerGroupFromEvents(updatedEventsArr);
      } else if (updatedEventsArr.every(isChildWorkflowExecutionEvent)) {
        groupByFirstEventId[groupId] =
          getChildWorkflowExecutionGroupFromEvents(updatedEventsArr);
      } else if (
        updatedEventsArr.every(isSignalExternalWorkflowExecutionEvent)
      ) {
        groupByFirstEventId[groupId] =
          getSignalExternalWorkflowExecutionGroupFromEvents(updatedEventsArr);
      } else if (
        updatedEventsArr.every(isRequestCancelExternalWorkflowExecutionEvent)
      ) {
        groupByFirstEventId[groupId] =
          getRequestCancelExternalWorkflowExecutionGroupFromEvents(
            updatedEventsArr
          );
      } else if (updatedEventsArr.every(isSingleEvent)) {
        groupByFirstEventId[groupId] =
          getSingleEventGroupFromEvents(updatedEventsArr);
      } else {
        logger.warn(
          {
            eventId: event.eventId,
            eventTime: event.eventTime,
            events: updatedEventsArr.map(({ eventId, eventTime }) => ({
              eventId,
              eventTime,
            })),
          },
          'No handler for grouping this event'
        );
      }
    }
  });

  // processing pending tasks
  pendingStartActivities.forEach((pa) => {
    const groupId = getHistoryEventGroupId(pa);
    if (!groupId) {
      logger.warn(
        {
          computedEventId: pa.computedEventId,
          eventTime: pa.eventTime,
        },
        "Couldn't extract groupId from event, check event payload and extraction logic"
      );
    } else {
      const currentGroup = groupByFirstEventId[groupId];
      // add pendingStart to group only if it is schedueled
      if (
        pa.eventTime &&
        currentGroup &&
        currentGroup?.events.length === 1 &&
        currentGroup.events[0].attributes ===
          'activityTaskScheduledEventAttributes' &&
        currentGroup.events.every(isExtendedActivityEvent)
      ) {
        const updatedEventsArr: ExtendedActivityHistoryEvent[] = [
          ...currentGroup.events,
          pa,
        ];
        groupByFirstEventId[groupId] =
          getActivityGroupFromEvents(updatedEventsArr);
      }
    }
  });

  if (pendingScheduleDecision && pendingScheduleDecision.eventTime) {
    const groupId = getHistoryEventGroupId(pendingScheduleDecision);
    if (!groupId) {
      logger.warn(
        {
          eventId: pendingScheduleDecision.eventId,
          eventTime: pendingScheduleDecision.eventTime,
        },
        "Couldn't extract groupId from event, check event payload and extraction logic"
      );
    } else if (
      !groupByFirstEventId[groupId] ||
      groupByFirstEventId[groupId].events.length === 0
    ) {
      const previousEventId = String(
        parseInt(pendingScheduleDecision.eventId) - 1
      );
      const findPreviousEvent = allEvents.find(
        (e) => e.eventId === previousEventId
      );
      const previousGroupId = findPreviousEvent
        ? getHistoryEventGroupId(findPreviousEvent)
        : null;
      if (previousGroupId && groupByFirstEventId[previousGroupId]) {
        const updatedEventsArr: ExtendedDecisionHistoryEvent[] = [
          pendingScheduleDecision,
        ];
        groupByFirstEventId[groupId] =
          getDecisionGroupFromEvents(updatedEventsArr);
      }
    }
  }

  return groupByFirstEventId;
}
