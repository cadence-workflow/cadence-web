import { useContext } from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';
import WorkflowHistoryViewToggleButton from '@/views/workflow-history-v2/workflow-history-view-toggle-button/workflow-history-view-toggle-button';

import workflowHistorySwitchToV2ButtonTooltipContentConfig from '../config/workflow-history-switch-to-v2-button-tooltip-content.config';
import { WorkflowHistoryContext } from '../workflow-history-context-provider/workflow-history-context-provider';

export default function WorkflowHistorySwitchToV2Button() {
  const { data: historyPageV2Config } = useConfigValue(
    'HISTORY_PAGE_V2_ENABLED'
  );

  const { setIsWorkflowHistoryV2Selected } = useContext(WorkflowHistoryContext);

  if (historyPageV2Config === 'DISABLED' || historyPageV2Config === 'ENABLED') {
    return null;
  }

  return (
    <WorkflowHistoryViewToggleButton
      kind="primary"
      label="Switch to the new History view"
      onClick={() => setIsWorkflowHistoryV2Selected(true)}
      tooltipContent={workflowHistorySwitchToV2ButtonTooltipContentConfig}
    />
  );
}
