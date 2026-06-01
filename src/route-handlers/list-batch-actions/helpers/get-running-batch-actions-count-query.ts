import {
  BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE,
  BATCH_ACTION_WORKFLOW_TYPE,
} from '../list-batch-actions.constants';

export default function getRunningBatchActionsCountQuery({
  domain,
}: {
  domain: string;
}): string {
  return (
    `WorkflowType = "${BATCH_ACTION_WORKFLOW_TYPE}" ` +
    `AND ${BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE} = "${domain}" ` +
    `AND CloseTime = missing`
  );
}
