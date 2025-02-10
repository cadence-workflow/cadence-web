import { type ClsObjectFor } from '@/hooks/use-styletron-classes';

import { type HistoryEventsGroup } from '../../workflow-history.types';
import { type cssStyles } from '../workflow-history-timeline-chart.styles';

import isValidClassNameKey from './is-valid-class-name-key';

export default function getClassNameForEventGroup(
  group: HistoryEventsGroup,
  classes: ClsObjectFor<typeof cssStyles>,
  isSelected: boolean
): string {
  let kind: string, color: string;

  if (group.groupType === 'Timer') {
    kind = 'timer';
    switch (group.status) {
      case 'CANCELED':
      case 'FAILED':
        color = 'Negative';
        break;
      case 'COMPLETED':
        color = 'Completed';
        break;
      default:
        color = 'Waiting';
        break;
    }
  } else if (group.groupType === 'Event') {
    kind = 'single';
    switch (group.status) {
      case 'CANCELED':
      case 'FAILED':
        color = 'Negative';
        break;
      default:
        color = 'Completed';
        break;
    }
  } else {
    kind = 'regular';
    switch (group.status) {
      case 'CANCELED':
      case 'FAILED':
        color = 'Negative';
        break;
      case 'COMPLETED':
        color = 'Completed';
        break;
      case 'WAITING':
        color = 'Waiting';
        break;
      default:
        color = 'Ongoing';
        break;
    }
  }

  const classNameKey = `${kind}${color}${isSelected ? 'Selected' : ''}`;

  if (isValidClassNameKey(classes, classNameKey)) {
    return classes[classNameKey];
  }

  return classes.regularWaiting;
}
