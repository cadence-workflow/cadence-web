import formatDuration from '@/utils/data-formatters/format-duration';
import dayjs from '@/utils/datetime/dayjs';

import { type Props } from '../workflow-history-events-duration-badge.types';

export default function getFormattedEventsDuration(
  startTime: Props['startTime'],
  endTime: Props['closeTime'] | Props['workflowCloseTime']
) {
  const end = endTime ? dayjs(endTime) : dayjs();
  const start = dayjs(startTime);
  const diff = end.diff(start);
  const durationObj = dayjs.duration(diff);
  return formatDuration(
    {
      seconds: durationObj.asSeconds().toString(),
      nanos: 0,
    },
    { separator: ' ' }
  );
}
