import Link from '@/components/link/link';
import { type RestartWorkflowResponse } from '@/route-handlers/restart-workflow/restart-workflow.types';

import { type WorkflowActionSuccessMessageProps } from '../workflow-actions.types';

const WorkflowActionRestartSuccessMsg = ({
  result: { runId },
  inputParams: { workflowId, cluster, domain },
}: WorkflowActionSuccessMessageProps<RestartWorkflowResponse>) => {
  return (
    <>
      Workflow has been restarted.{' '}
      <Link
        color="contentInversePrimary"
        href={`/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}`}
      >
        Click here
      </Link>{' '}
      to view the new workflow.
    </>
  );
};

export default WorkflowActionRestartSuccessMsg;
