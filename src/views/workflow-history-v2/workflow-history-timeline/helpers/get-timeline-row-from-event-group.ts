import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import { WORKFLOW_HISTORY_EVENT_GROUP_TYPE_TO_CATEGORY_MAP } from '../../workflow-history-filters-menu/workflow-history-filters-menu.constants';
import { type HistoryEventsGroup } from '../../workflow-history-v2.types';
import { type TimelineRow } from '../workflow-history-timeline.types';

export default function getTimelineRowFromEventGroup(
  groupId: string,
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

  let groupEndMs = null;

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

  const eventGroupCategory =
    WORKFLOW_HISTORY_EVENT_GROUP_TYPE_TO_CATEGORY_MAP[group.groupType];

  return {
    id: groupId,
    label: group.label,
    startTimeMs: groupStartMs,
    endTimeMs: groupEndMs,
    category: eventGroupCategory,
    status: group.status,
    group,
  };
}
