import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import formatTimestampToDatetime from '../format-timestamp-to-datetime';
import formatWorkflowHistoryEventType from '../format-workflow-history-event-type';

export default function formatWorkflowCommonEventFields<
  T extends HistoryEvent['attributes'],
>({
  eventId,
  eventTime,
  attributes,
  ...rest
}: {
  eventId: HistoryEvent['eventId'];
  eventTime: HistoryEvent['eventTime'];
  attributes: T;
}) {
  return {
    ...rest,
    eventId: parseInt(eventId),
    timestamp: formatTimestampToDatetime(eventTime),
    eventType: formatWorkflowHistoryEventType<T>(attributes),
  };
}
