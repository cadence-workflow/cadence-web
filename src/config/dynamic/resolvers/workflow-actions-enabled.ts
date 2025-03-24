import { WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES } from './workflow-actions-enabled.constants';
import {
  type WorkflowActionsEnabledConfig,
  type WorkflowActionsEnabledResolverParams,
} from './workflow-actions-enabled.types';

/**
 * If you have authentication enabled for users, override this resolver
 * to control whether users can access workflow actions in the UI
 */
export default async function workflowActionsEnabled(
  _: WorkflowActionsEnabledResolverParams
): Promise<WorkflowActionsEnabledConfig> {
  return {
    terminate: WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES.enabled,
    cancel: WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES.disabled_unknown,
    restart: WORKFLOW_ACTIONS_ENABLED_CONFIG_VALUES.enabled,
  };
}
