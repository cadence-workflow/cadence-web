import request from '@/utils/request';

import getWorkflowFirstHistoryPageQueryOptions from '../get-workflow-first-history-page-query-options';

jest.mock('@/utils/request', () => jest.fn());

const params = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  workflowId: 'test-workflow-id',
  runId: 'test-run-id',
};

describe(getWorkflowFirstHistoryPageQueryOptions.name, () => {
  beforeEach(() => {
    jest.mocked(request).mockResolvedValue({
      json: async () => ({ history: { events: [] } }),
    } as Response);
  });

  it('returns a query key with the params and a page size of one', () => {
    const options = getWorkflowFirstHistoryPageQueryOptions(params);

    expect(options.queryKey).toEqual([
      'workflow_history',
      { ...params, pageSize: 1 },
    ]);
  });

  it('requests the first history page', async () => {
    const options = getWorkflowFirstHistoryPageQueryOptions(params);
    const queryFn = options.queryFn as Exclude<
      typeof options.queryFn,
      symbol | undefined
    >;

    await queryFn({
      queryKey: options.queryKey,
      signal: new AbortController().signal,
      meta: undefined,
    });

    expect(request).toHaveBeenCalledWith(
      '/api/domains/test-domain/test-cluster/workflows/test-workflow-id/test-run-id/history?pageSize=1'
    );
  });
});
