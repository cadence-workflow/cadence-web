import { useQuery } from '@tanstack/react-query';
import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import getWorkflowFirstHistoryPageQueryOptions from '../get-workflow-first-history-page-query-options';

const params = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  workflowId: 'test-workflow-id',
  runId: 'test-run-id',
};

describe(getWorkflowFirstHistoryPageQueryOptions.name, () => {
  it('returns a query key with the params and a page size of one', () => {
    const options = getWorkflowFirstHistoryPageQueryOptions(params);

    expect(options.queryKey).toEqual([
      'workflow_history',
      { ...params, pageSize: 1 },
    ]);
  });

  it('requests the first history page', async () => {
    const requestedUrls: Array<string> = [];

    const { result } = renderHook(
      () => useQuery(getWorkflowFirstHistoryPageQueryOptions(params)),
      {
        endpointsMocks: [
          {
            path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/history',
            httpMethod: 'GET',
            mockOnce: false,
            httpResolver: async ({ request }) => {
              requestedUrls.push(request.url);
              return HttpResponse.json({
                history: { events: [] },
                rawHistory: [],
                nextPageToken: '',
              });
            },
          },
        ],
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(requestedUrls).toHaveLength(1);
    const url = new URL(requestedUrls[0]);
    expect(url.pathname).toBe(
      '/api/domains/test-domain/test-cluster/workflows/test-workflow-id/test-run-id/history'
    );
    expect(url.searchParams.get('pageSize')).toBe('1');
  });
});
