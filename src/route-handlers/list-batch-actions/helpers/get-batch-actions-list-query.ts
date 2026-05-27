import { BATCH_ACTION_WORKFLOW_TYPE } from '@/views/domain-batch-actions/domain-batch-actions.constants';

import { BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE } from '../list-batch-actions.constants';

export default function getBatchActionsListQuery({
  domain,
}: {
  domain: string;
}): string {
  const escapedDomain = domain
    .replace(/\\/g, '\\\\')
    .replace(/['"]/g, (match) => `\\${match}`);

  return (
    `WorkflowType = "${BATCH_ACTION_WORKFLOW_TYPE}" ` +
    `AND ${BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE} = "${escapedDomain}" ` +
    `ORDER BY StartTime DESC`
  );
}
