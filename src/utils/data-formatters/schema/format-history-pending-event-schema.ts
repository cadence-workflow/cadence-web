import { type z } from 'zod';

import { type PendingHistoryEvent } from '@/views/workflow-history/workflow-history.types';

import formatPendingActivityTaskStartEvent from '../format-pending-workflow-history-event/format-pending-activity-start-event';
import formatPendingDecisionTaskScheduleEvent from '../format-pending-workflow-history-event/format-pending-decision-schedule-event';

import {
  pendingActivityTaskStartSchema,
  pendingDecisionTaskScheduleSchema,
} from './pending-history-event-schema';

export const formatPendingActivityTaskStartEventSchema =
  pendingActivityTaskStartSchema.transform(formatPendingActivityTaskStartEvent);

export const formatPendingDecisionTaskScheduleEventSchema =
  pendingDecisionTaskScheduleSchema.transform(
    formatPendingDecisionTaskScheduleEvent
  );

function unExistingEventType(_: never) {
  return null;
}
export const getFormatPendingEventSchema = (event: PendingHistoryEvent) => {
  switch (event.attributes) {
    case 'pendingActivityTaskStartEventAttributes':
      return formatPendingActivityTaskStartEventSchema;
    case 'pendingDecisionTaskScheduleEventAttributes':
      return formatPendingDecisionTaskScheduleEventSchema;
    default:
      return unExistingEventType(event); // should not be unreachable, used to show a type error if not all attributes cases are covered
  }
};

export type FormattedPendingActivityTaskStartEvent = z.infer<
  typeof formatPendingActivityTaskStartEventSchema
>;
export type FormattedPendingDecisionTaskScheduleEvent = z.infer<
  typeof formatPendingDecisionTaskScheduleEventSchema
>;

export type FormattedHistoryPendingEvent =
  | FormattedPendingActivityTaskStartEvent
  | FormattedPendingDecisionTaskScheduleEvent;
