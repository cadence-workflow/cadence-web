import { type ClsObjectFor } from '@/hooks/use-styletron-classes';
import dayjs from '@/utils/datetime/dayjs';
import parseGrpcTimestamp from '@/utils/datetime/parse-grpc-timestamp';

import { type HistoryEventsGroup } from '../../workflow-history.types';
import { type cssStyles } from '../workflow-history-timeline-chart.styles';
import { type TimelineChartItem } from '../workflow-history-timeline-chart.types';

import getClassNameForEventGroup from './get-class-name-for-event-group';

export default function convertEventGroupToTimelineChartItem(
  group: HistoryEventsGroup,
  classes: ClsObjectFor<typeof cssStyles>
): TimelineChartItem | undefined {
  if (group.events.length === 0) {
    return undefined;
  }

  const eventStartTimestamp = group.events[0].eventTime;
  if (!eventStartTimestamp) {
    return undefined;
  }
  const groupStartDayjs = dayjs(parseGrpcTimestamp(eventStartTimestamp));

  let groupEndDayjs = dayjs();

  if (group.status === 'ONGOING' || group.status === 'WAITING') {
    if (group.groupType === 'Timer') {
      const timerDuration =
        group.events[0].timerStartedEventAttributes?.startToFireTimeout;

      if (timerDuration) {
        const timerDurationMs = parseGrpcTimestamp(timerDuration);
        groupEndDayjs = groupStartDayjs.add(timerDurationMs, 'milliseconds');
      }
    }
  } else if (group.timeMs) {
    groupEndDayjs = dayjs(group.timeMs);
  }

  return {
    start: groupStartDayjs.toDate(),
    end: groupEndDayjs.toDate(),
    content: group.label,
    title: `${group.label}: ${group.timeLabel}`,
    type: group.groupType === 'Event' ? 'point' : 'range',
    className: getClassNameForEventGroup(group, classes),
  };
}
