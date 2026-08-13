import {
  BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE,
  BATCH_ACTION_WORKFLOW_TYPE,
} from '../../list-batch-actions.constants';
import getRunningBatchActionsCountQuery from '../get-running-batch-actions-count-query';

describe('getRunningBatchActionsCountQuery', () => {
  it('builds a query filtered by workflow type, custom domain, and open state', () => {
    expect(getRunningBatchActionsCountQuery({ domain: 'my-domain' })).toBe(
      `WorkflowType = "${BATCH_ACTION_WORKFLOW_TYPE}" ` +
        `AND ${BATCH_ACTION_DOMAIN_SEARCH_ATTRIBUTE} = "my-domain" ` +
        `AND CloseTime = missing`
    );
  });
});
