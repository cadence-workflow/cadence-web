import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import getEventGroupFilteringType from '../../workflow-history-event-group/helpers/get-event-group-filtering-type';
import { type TimelineRow } from '../workflow-history-timeline.types';

export default function getTimelineRowFromEventGroup(
  group: HistoryEventsGroup,
  workflowStartTimeMs: number | null
): TimelineRow | undefined {
  if (workflowStartTimeMs === null) {
    return undefined;
  }

  if (group.events.length === 0) {
    return undefined;
  }

  const eventStartTimestamp = group.events[0].eventTime;
  if (!eventStartTimestamp) {
    return undefined;
  }

  const groupStartMs = parseGrpcTimestamp(eventStartTimestamp);

  let groupEndMs = Date.now();

  if (
    group.groupType === 'Timer' &&
    ['ONGOING', 'WAITING'].includes(group.status) &&
    group.expectedEndTimeInfo
  ) {
    groupEndMs = group.expectedEndTimeInfo.timeMs;
  } else if (
    group.timeMs &&
    ['COMPLETED', 'FAILED', 'CANCELED'].includes(group.status)
  ) {
    groupEndMs = group.timeMs;
  }

  const groupType = getEventGroupFilteringType(group);

  return {
    id: group.firstEventId ?? 'unknown',
    label: group.label,
    startTimeMs: groupStartMs,
    endTimeMs: groupEndMs,
    groupType,
    status: group.status,
    group,
  };
}
