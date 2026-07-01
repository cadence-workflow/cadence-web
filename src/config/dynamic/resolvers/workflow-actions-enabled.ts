import domainAccess from './domain-access';
import {
  AUTHORIZED_WORKFLOW_ACTIONS_CONFIG,
  DEFAULT_DISABLED_WORKFLOW_ACTIONS_CONFIG,
  UNAUTHORIZED_WORKFLOW_ACTIONS_CONFIG,
} from './workflow-actions-enabled.constants';
import {
  type WorkflowActionsEnabledConfig,
  type WorkflowActionsEnabledResolverParams,
} from './workflow-actions-enabled.types';

/**
 * Override this resolver if you have different
 * requirements for enabling/disabling workflow actions.
 *
 * All workflow actions are enabled by default if authorization is disabled.
 * Otherwise it is only enabled for users with write access to domain.
 * Domain access is resolved via the DOMAIN_ACCESS config resolver.
 */
export default async function workflowActionsEnabled(
  params: WorkflowActionsEnabledResolverParams
): Promise<WorkflowActionsEnabledConfig> {
  try {
    const access = await domainAccess(params);
    if (!access.canWrite) {
      return UNAUTHORIZED_WORKFLOW_ACTIONS_CONFIG;
    }

    return AUTHORIZED_WORKFLOW_ACTIONS_CONFIG;
  } catch {
    return DEFAULT_DISABLED_WORKFLOW_ACTIONS_CONFIG;
  }
}
