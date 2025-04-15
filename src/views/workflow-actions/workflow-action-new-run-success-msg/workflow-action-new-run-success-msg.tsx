import Link from '@/components/link/link';

import { type Props } from './workflow-action-new-run-success-msg.types';

const WorkflowActionNewRunSuccessMsg = ({
  result: { runId },
  inputParams: { workflowId, cluster, domain },
  successMessage,
  onDismissMessage,
}: Props) => {
  return (
    <>
      {successMessage}{' '}
      <Link
        color="contentInversePrimary"
        href={`/domains/${domain}/${cluster}/workflows/${workflowId}/${runId}`}
        onClick={onDismissMessage}
      >
        Click here
      </Link>{' '}
      to view the new workflow.
    </>
  );
};

export default WorkflowActionNewRunSuccessMsg;
