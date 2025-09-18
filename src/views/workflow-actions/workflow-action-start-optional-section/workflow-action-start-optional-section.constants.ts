import { WorkflowIdReusePolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowIdReusePolicy';
import { WORKFLOW_ID_REUSE_POLICIES } from '@/route-handlers/start-workflow/start-workflow.constants';

export const workflowIdReusePolicyLabels: Record<
  Exclude<WorkflowIdReusePolicy, 'WORKFLOW_ID_REUSE_POLICY_INVALID'>,
  string
> = {
  [WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE]:
    'Allow Duplicate',
  [WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE_FAILED_ONLY]:
    'Allow Duplicate Failed Only',
  [WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_REJECT_DUPLICATE]:
    'Reject Duplicate',
  [WorkflowIdReusePolicy.WORKFLOW_ID_REUSE_POLICY_TERMINATE_IF_RUNNING]:
    'Terminate If Running',
};

export const workflowIdReusePolicyOptions = WORKFLOW_ID_REUSE_POLICIES.map(
  (policy) => ({
    id: policy,
    label: workflowIdReusePolicyLabels[policy],
  })
);
