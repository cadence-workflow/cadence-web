import { useContext } from 'react';

import useConfigValue from '@/hooks/use-config-value/use-config-value';
import { WorkflowHistoryContext } from '@/views/workflow-history/workflow-history-context-provider/workflow-history-context-provider';

import workflowHistorySwitchToV1ButtonTooltipContentConfig from '../config/workflow-history-switch-to-v1-button-tooltip-content.config';
import WorkflowHistoryViewToggleButton from '../workflow-history-view-toggle-button/workflow-history-view-toggle-button';

export default function WorkflowHistorySwitchToV1Button() {
  const { data: historyPageV2Config } = useConfigValue(
    'HISTORY_PAGE_V2_ENABLED'
  );

  const { setIsWorkflowHistoryV2Selected } = useContext(WorkflowHistoryContext);

  if (historyPageV2Config === 'DISABLED' || historyPageV2Config === 'ENABLED') {
    return null;
  }

  return (
    <WorkflowHistoryViewToggleButton
      kind="secondary"
      label="Switch to the legacy History view"
      onClick={() => setIsWorkflowHistoryV2Selected(false)}
      tooltipContent={workflowHistorySwitchToV1ButtonTooltipContentConfig}
    />
  );
}
