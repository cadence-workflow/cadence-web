import formatDate from '@/utils/data-formatters/format-date';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import {
  type HistoryGroupEventStatusToNegativeFieldsMap,
  type HistoryEventsGroup,
  type HistoryGroupEventToStatusMap,
  type HistoryGroupEventToStringMap,
} from '../workflow-history.types';

export default function getCommonHistoryGroupFields<
  GroupT extends HistoryEventsGroup,
>(
  events: GroupT['events'],
  historyGroupEventToStatusMap: HistoryGroupEventToStatusMap<GroupT>,
  eventToLabelMap: HistoryGroupEventToStringMap<GroupT>,
  eventToTimeLabelPrefixMap: Partial<HistoryGroupEventToStringMap<GroupT>>,
  closeEvent: GroupT['events'][number] | null | undefined,
  eventStatusToNegativeFieldsMap?: HistoryGroupEventStatusToNegativeFieldsMap<GroupT>
): Pick<
  GroupT,
  | 'eventsMetadata'
  | 'events'
  | 'status'
  | 'timeMs'
  | 'timeLabel'
  | 'closeTimeMs'
  | 'startTimeMs'
  | 'firstEventId'
> {
  const eventsMetadata = events.map((event, index) => {
    const attrs = event.attributes as GroupT['events'][number]['attributes'];
    const getEventStatus = historyGroupEventToStatusMap[attrs];
    const eventStatus: WorkflowEventStatus =
      typeof getEventStatus === 'function'
        ? getEventStatus(event, events, index)
        : getEventStatus;
    const timeMs = event.eventTime ? parseGrpcTimestamp(event.eventTime) : null;
    const prefix = eventToTimeLabelPrefixMap.hasOwnProperty(attrs)
      ? eventToTimeLabelPrefixMap[attrs]
      : `${eventToLabelMap[attrs]} at`;

    const negativeFields = eventStatusToNegativeFieldsMap?.[attrs];

    return {
      label: eventToLabelMap[attrs],
      status: eventStatus,
      timeMs,
      timeLabel: timeMs ? `${prefix} ${formatDate(timeMs)}` : '',
      ...(negativeFields?.length ? { negativeFields } : {}),
    };
  });

  const groupFirstEventId = events[0].eventId;
  const groupStatus = eventsMetadata[eventsMetadata.length - 1].status;
  const groupTimeMs = eventsMetadata[eventsMetadata.length - 1].timeMs;
  const groupStartTimeMs = eventsMetadata[0].timeMs;
  const groupTimeLabel = eventsMetadata[eventsMetadata.length - 1].timeLabel;
  const groupCloseTimeMs = closeEvent?.eventTime
    ? parseGrpcTimestamp(closeEvent.eventTime)
    : null;

  return {
    eventsMetadata,
    events,
    status: groupStatus,
    timeMs: groupTimeMs,
    startTimeMs: groupStartTimeMs,
    closeTimeMs: groupCloseTimeMs,
    timeLabel: groupTimeLabel,
    firstEventId: groupFirstEventId,
  };
}
