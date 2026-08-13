import { type MouseEvent } from 'react';

import { Checkbox } from 'baseui/checkbox';
import { StatefulTooltip } from 'baseui/tooltip';

import { styled } from './workflows-list-selection-cell.styles';
import { type Props } from './workflows-list-selection-cell.types';

export default function WorkflowsListSelectionCell({
  selection,
  workflow,
}: Props) {
  const checkbox = (
    <Checkbox
      checked={selection.isSelected(workflow)}
      disabled={selection.isRowToggleDisabled}
      onChange={() => {}}
      aria-label={`Select workflow ${workflow.workflowID} run ${workflow.runID}`}
    />
  );

  return (
    <styled.CheckboxCell
      onClickCapture={(e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selection.isRowToggleDisabled) {
          selection.onToggle(workflow);
        }
      }}
    >
      {selection.isRowToggleDisabled && selection.rowToggleDisabledReason ? (
        <StatefulTooltip
          placement="right"
          showArrow
          accessibilityType="tooltip"
          content={selection.rowToggleDisabledReason}
        >
          {/* span so the tooltip can attach hover handlers — a disabled checkbox
              does not receive them. */}
          <span>{checkbox}</span>
        </StatefulTooltip>
      ) : (
        checkbox
      )}
    </styled.CheckboxCell>
  );
}
