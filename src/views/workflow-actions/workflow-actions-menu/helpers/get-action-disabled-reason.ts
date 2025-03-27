import { type WorkflowActionEnabledConfigValue } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';

import WORKFLOW_ACTIONS_DISABLED_REASONS_CONFIG from '../../config/workflow-actions-disabled-reasons.config';
import WORKFLOW_ACTIONS_NON_RUNNABLE_REASONS_CONFIG from '../../config/workflow-actions-non-runnable-reasons.config';
import { type WorkflowActionRunnableStatus } from '../../workflow-actions.types';

export default function getActionDisabledReason({
  actionEnabledConfig,
  actionRunnableStatus,
}: {
  actionEnabledConfig?: WorkflowActionEnabledConfigValue;
  actionRunnableStatus: WorkflowActionRunnableStatus;
}): string | undefined {
  if (actionEnabledConfig !== 'ENABLED') {
    return WORKFLOW_ACTIONS_DISABLED_REASONS_CONFIG[
      actionEnabledConfig ?? 'DISABLED_DEFAULT'
    ];
  }

  if (actionRunnableStatus !== 'RUNNABLE') {
    return WORKFLOW_ACTIONS_NON_RUNNABLE_REASONS_CONFIG[actionRunnableStatus];
  }

  return undefined;
}
