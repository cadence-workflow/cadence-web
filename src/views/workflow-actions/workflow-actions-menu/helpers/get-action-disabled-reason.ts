import { type WorkflowActionsEnabledConfig } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';

import { type WorkflowActionID } from '../../workflow-actions.types';
import { WORKFLOW_ACTIONS_DISABLED_LABELS } from '../workflow-actions-menu.constants';

export default function getActionDisabledReason({
  actionsEnabledConfig,
  actionId,
  isActionRunnable,
}: {
  actionsEnabledConfig?: WorkflowActionsEnabledConfig;
  actionId: WorkflowActionID;
  isActionRunnable: boolean;
}): string | undefined {
  if (!actionsEnabledConfig) {
    return 'Workflow actions config has not loaded yet';
  }

  const actionEnabledConfig = actionsEnabledConfig[actionId];
  if (actionEnabledConfig !== 'ENABLED') {
    return WORKFLOW_ACTIONS_DISABLED_LABELS[actionEnabledConfig];
  }

  if (!isActionRunnable) {
    return 'Workflow action is not currently runnable';
  }

  return undefined;
}
