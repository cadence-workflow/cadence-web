import formatDate from '@/utils/data-formatters/format-date';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import { type WorkflowEventStatus } from '../workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import {
  type HistoryEventsGroup,
  type HistoryGroupEventToStatusMap,
  type HistoryGroupEventToStringMap,
} from '../workflow-history.types';

export default function getCommonHistoryGroupFields<
  GroupT extends HistoryEventsGroup,
>(
  events: GroupT['events'],
  HistoryGroupEventToStatusMap: HistoryGroupEventToStatusMap<GroupT>,
  eventToLabelMap: HistoryGroupEventToStringMap<GroupT>,
  eventToTimeLabelPrefixMap: Partial<HistoryGroupEventToStringMap<GroupT>>
): Pick<
  GroupT,
  'eventsMetadata' | 'events' | 'status' | 'timeMs' | 'timeLabel'
> {
  const eventsMetadata = events.map((event, index) => {
    const attrs = event.attributes as GroupT['events'][number]['attributes'];
    const getEventStatus = HistoryGroupEventToStatusMap[attrs];
    const eventStatus: WorkflowEventStatus =
      typeof getEventStatus === 'function'
        ? getEventStatus(event, events, index)
        : getEventStatus;
    const timeMs = event.eventTime ? parseGrpcTimestamp(event.eventTime) : null;
    const prefix = eventToTimeLabelPrefixMap.hasOwnProperty(attrs)
      ? eventToTimeLabelPrefixMap[attrs]
      : `${eventToLabelMap[attrs]} at`;
    return {
      label: eventToLabelMap[attrs],
      status: eventStatus,
      timeMs,
      timeLabel: timeMs ? `${prefix} ${formatDate(timeMs)}` : '',
    };
  });

  const groupStatus = eventsMetadata[eventsMetadata.length - 1].status;
  const groupTimeMs = eventsMetadata[eventsMetadata.length - 1].timeMs;
  const groupTimeLabel = eventsMetadata[eventsMetadata.length - 1].timeLabel;

  return {
    eventsMetadata,
    events,
    status: groupStatus,
    timeMs: groupTimeMs,
    timeLabel: groupTimeLabel,
  };
}
