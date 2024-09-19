import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import logger from '@/utils/logger';

import type {
  HistoryEventsGroup,
  HistoryEventsGroups,
} from '../workflow-history.types';

import isActivityEvent from './check-history-event-group/is-activity-event';
import isChildWorkflowExecutionEvent from './check-history-event-group/is-child-workflow-execution-event';
import isDecisionEvent from './check-history-event-group/is-decision-event';
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
  initialGroups: HistoryEventsGroups = {}
) {
  const groupByFirstEventId: HistoryEventsGroups = initialGroups;
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
      if (updatedEventsArr.every(isActivityEvent)) {
        groupByFirstEventId[groupId] =
          getActivityGroupFromEvents(updatedEventsArr);
      } else if (updatedEventsArr.every(isDecisionEvent)) {
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
  return groupByFirstEventId;
}
