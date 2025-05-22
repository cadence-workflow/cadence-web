import { StatefulTooltip } from 'baseui/tooltip';

import { type Props } from './workflow-history-group-label.types';

export default function WorkflowHistoryGroupLabel({ label, fullName }: Props) {
  if (!fullName) return <>{label}</>;

  return (
    <StatefulTooltip
      showArrow
      placement="bottom"
      popoverMargin={8}
      accessibilityType="tooltip"
      content={() => fullName}
      returnFocus
      autoFocus
    >
      {label}
    </StatefulTooltip>
  );
}
