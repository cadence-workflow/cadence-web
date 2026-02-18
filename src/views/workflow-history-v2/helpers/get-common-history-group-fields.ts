import formatDate from '@/utils/data-formatters/format-date';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import {
  type HistoryGroupEventToNegativeFieldsMap,
  type HistoryEventsGroup,
  type HistoryGroupEventToStatusMap,
  type HistoryGroupEventToStringMap,
  type HistoryGroupEventToAdditionalDetailsMap,
  type HistoryGroupEventToSummaryFieldsMap,
  type WorkflowEventStatus,
} from '../workflow-history-v2.types';

export default function getCommonHistoryGroupFields<
  GroupT extends HistoryEventsGroup,
>(
  events: GroupT['events'],
  historyGroupEventToStatusMap: HistoryGroupEventToStatusMap<GroupT>,
  eventToLabelMap: HistoryGroupEventToStringMap<GroupT>,
  eventToTimeLabelPrefixMap: Partial<HistoryGroupEventToStringMap<GroupT>>,
  closeEvent: GroupT['events'][number] | null | undefined,
  eventToNegativeFieldsMap?: HistoryGroupEventToNegativeFieldsMap<GroupT>,
  eventToAdditionalDetailsMap?: HistoryGroupEventToAdditionalDetailsMap<GroupT>,
  eventToSummaryFieldsMap?: HistoryGroupEventToSummaryFieldsMap<GroupT>
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

    const negativeFields = eventToNegativeFieldsMap?.[attrs];
    const additionalDetails = eventToAdditionalDetailsMap?.[attrs];
    const summaryFields = eventToSummaryFieldsMap?.[attrs];

    return {
      label: eventToLabelMap[attrs],
      status: eventStatus,
      timeMs,
      timeLabel: timeMs ? `${prefix} ${formatDate(timeMs)}` : '',
      ...(negativeFields?.length ? { negativeFields } : {}),
      ...(additionalDetails ? { additionalDetails } : {}),
      ...(summaryFields?.length ? { summaryFields } : {}),
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
