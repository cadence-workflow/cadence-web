import { StatefulTooltip } from 'baseui/tooltip';

import { type Props } from './workflow-history-group-label.types';

export default function WorkflowHistoryGroupLabel({
  label,
  shortLabel,
}: Props) {
  if (!shortLabel) return <>{label}</>;

  return (
    <StatefulTooltip
      showArrow
      placement="bottom"
      popoverMargin={8}
      accessibilityType="tooltip"
      content={() => label}
      returnFocus
      autoFocus
    >
      {shortLabel}
    </StatefulTooltip>
  );
}
