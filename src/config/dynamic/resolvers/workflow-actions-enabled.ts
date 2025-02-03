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
  await new Promise((resolve) => setTimeout(resolve, 100000));
  return {
    terminate: true,
    cancel: true,
  };
}
