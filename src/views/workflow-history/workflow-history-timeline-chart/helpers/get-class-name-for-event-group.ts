import { type ClsObjectFor } from '@/hooks/use-styletron-classes';

import { type HistoryEventsGroup } from '../../workflow-history.types';
import { type cssStyles } from '../workflow-history-timeline-chart.styles';

export default function getClassNameForEventGroup(
  group: HistoryEventsGroup,
  classes: ClsObjectFor<typeof cssStyles>
): string {
  if (group.groupType === 'Timer') {
    switch (group.status) {
      case 'CANCELED':
      case 'FAILED':
        return classes.timerNegative;
      case 'COMPLETED':
        return classes.timerCompleted;
      default:
        return classes.timer;
    }
  } else {
    switch (group.status) {
      case 'CANCELED':
      case 'FAILED':
        return classes.negative;
      case 'COMPLETED':
        return classes.completed;
      case 'WAITING':
        return classes.waiting;
      default:
        return classes.ongoing;
    }
  }
}
