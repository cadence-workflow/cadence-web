import { WorkflowIdReusePolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowIdReusePolicy';

export const WORKER_SDK_LANGUAGES = ['GO', 'JAVA'] as const;

export const DEFAULT_TASK_START_TO_CLOSE_TIMEOUT_SECONDS = 10;

export const WORKFLOW_ID_REUSE_POLICIES = [
  WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE,
  WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE_FAILED_ONLY,
  WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE,
  WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_TERMINATE_IF_RUNNING,
] as const;
