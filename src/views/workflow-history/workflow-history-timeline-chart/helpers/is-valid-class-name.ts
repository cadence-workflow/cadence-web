import { type ClsObjectFor } from '@/hooks/use-styletron-classes';

import { type cssStyles } from '../workflow-history-timeline-chart.styles';

export default function isValidClassName(
  classes: ClsObjectFor<typeof cssStyles>,
  className: string
): className is keyof ClsObjectFor<typeof cssStyles> {
  return Object.hasOwn(classes, className);
}
