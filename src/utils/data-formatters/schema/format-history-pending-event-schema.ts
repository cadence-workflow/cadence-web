import { type z } from 'zod';

import { type PendingHistoryEvent } from '@/views/workflow-history/workflow-history.types';

import formatPendingActivityTaskStartEvent from '../format-pending-workflow-history-event/format-pending-activity-start-event';
import formatPendingDecisionTaskStartEvent from '../format-pending-workflow-history-event/format-pending-decision-start-event';

import {
  pendingActivityTaskStartSchema,
  pendingDecisionTaskStartSchema,
} from './pending-history-event-schema';

export const formatPendingActivityTaskStartEventSchema =
  pendingActivityTaskStartSchema.transform(formatPendingActivityTaskStartEvent);

export const formatPendingDecisionTaskStartEventSchema =
  pendingDecisionTaskStartSchema.transform(formatPendingDecisionTaskStartEvent);

function unExistingEventType(_: never) {
  return null;
}
export const getFormatPendingEventSchema = (event: PendingHistoryEvent) => {
  switch (event.attributes) {
    case 'pendingActivityTaskStartEventAttributes':
      return formatPendingActivityTaskStartEventSchema;
    case 'pendingDecisionTaskStartEventAttributes':
      return formatPendingDecisionTaskStartEventSchema;
    default:
      return unExistingEventType(event); // used to show a type error if any pending event attributes cases are not covered
  }
};

export type FormattedPendingActivityTaskStartEvent = z.infer<
  typeof formatPendingActivityTaskStartEventSchema
>;
export type FormattedPendingDecisionTaskScheduleEvent = z.infer<
  typeof formatPendingDecisionTaskStartEventSchema
>;

export type FormattedHistoryPendingEvent =
  | FormattedPendingActivityTaskStartEvent
  | FormattedPendingDecisionTaskScheduleEvent;
