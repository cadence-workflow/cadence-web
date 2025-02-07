import { type ClsObjectFor } from '@/hooks/use-styletron-classes';

import { type cssStyles } from '../workflow-history-timeline-chart.styles';

export default function isValidClassNameKey(
  classes: ClsObjectFor<typeof cssStyles>,
  key: string
): key is keyof ClsObjectFor<typeof cssStyles> {
  return Object.hasOwn(classes, key);
}
