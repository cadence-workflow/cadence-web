import { RiStethoscopeLine } from 'react-icons/ri';

import WorkflowHistoryDetailsRowDiagnosticsTooltip from '../../workflow-history-details-row-diagnostics-tooltip/workflow-history-details-row-diagnostics-tooltip';
import { type WorkflowDiagnosticsIssue } from '../../workflow-history.types';
import { type DetailsRowItem } from '../workflow-history-details-row.types';

export default function getDiagnosticsIssuesRowItem(
  diagnosticsIssues: Array<WorkflowDiagnosticsIssue>
): DetailsRowItem {
  return {
    path: 'diagnosticsIssues',
    label: 'Diagnostics issues',
    value: diagnosticsIssues,
    icon: RiStethoscopeLine,
    renderValue: ({ value }) =>
      value.length === 1 ? '1 issue' : `${value.length} issues`,
    renderTooltip: WorkflowHistoryDetailsRowDiagnosticsTooltip,
    invertTooltipColors: true,
    badgeColor: 'warning',
  };
}
