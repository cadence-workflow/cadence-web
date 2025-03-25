import { type WorkflowActionEnabledConfigValue } from '@/config/dynamic/resolvers/workflow-actions-enabled.types';

import { type WorkflowActionRunStatus } from '../../workflow-actions.types';
import {
  WORKFLOW_ACTION_DISABLED_LABELS,
  WORKFLOW_ACTION_RUN_STATUS_LABELS,
} from '../workflow-actions-menu.constants';

export default function getActionDisabledReason({
  actionEnabledConfig,
  actionRunStatus,
}: {
  actionEnabledConfig?: WorkflowActionEnabledConfigValue;
  actionRunStatus: WorkflowActionRunStatus;
}): string | undefined {
  if (!actionEnabledConfig) {
    return 'Workflow actions config has not loaded yet';
  }

  if (actionEnabledConfig !== 'ENABLED') {
    return WORKFLOW_ACTION_DISABLED_LABELS[actionEnabledConfig];
  }

  if (actionRunStatus !== 'RUNNABLE') {
    return WORKFLOW_ACTION_RUN_STATUS_LABELS[actionRunStatus];
  }

  return undefined;
}
