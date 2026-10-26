import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { mockDescribeWorkflowResponse } from '@/views/workflow-page/__fixtures__/describe-workflow-response';

import { WORKFLOW_HOME_QUERY_NAME } from '../../workflow-home.constants';
import useWorkflowHomeBadge from '../use-workflow-home-badge';

const params = { domain: 'd', cluster: 'c', workflowId: 'w', runId: 'r' };

describe(useWorkflowHomeBadge.name, () => {
  it('returns the badge name', async () => {
    const { result } = setup({
      data: { content: '# Hi', badgeName: 'Expense 1' },
    });
    await waitFor(() => expect(result.current).toBe('Expense 1'));
  });

  it('returns undefined without a badge', async () => {
    const { result, getQueryCalls } = setup({ data: { content: '# Hi' } });
    await waitFor(() => expect(getQueryCalls()).toBe(1));
    expect(result.current).toBeUndefined();
  });

  it('does not run the query when the feature is disabled', async () => {
    const { result, getQueryCalls } = setup({
      enabled: false,
      data: { content: '# Hi', badgeName: 'Expense 1' },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getQueryCalls()).toBe(0);
    expect(result.current).toBeUndefined();
  });

  it('does not run the query for archived workflows', async () => {
    const { result, getQueryCalls } = setup({
      archived: true,
      data: { content: '# Hi', badgeName: 'Expense 1' },
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getQueryCalls()).toBe(0);
    expect(result.current).toBeUndefined();
  });

  it('returns undefined when the query fails', async () => {
    const { result, getQueryCalls } = setup({});
    await waitFor(() => expect(getQueryCalls()).toBe(1));
    expect(result.current).toBeUndefined();
  });
});

function setup({
  data,
  enabled = true,
  archived = false,
}: {
  data?: { content: string; badgeName?: string };
  enabled?: boolean;
  archived?: boolean;
}) {
  let queryCalls = 0;
  const { result } = renderHook(
    () => useWorkflowHomeBadge(params),
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: {
            ...mockDescribeWorkflowResponse,
            workflowExecutionInfo: {
              ...mockDescribeWorkflowResponse.workflowExecutionInfo,
              isArchived: archived,
            },
          },
        },
        {
          path: `/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query/${WORKFLOW_HOME_QUERY_NAME}`,
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async () => {
            queryCalls++;
            if (data === undefined) {
              return HttpResponse.json({ message: 'nope' }, { status: 500 });
            }
            return HttpResponse.json({
              result: {
                cadenceResponseType: 'formattedData',
                format: 'text/markdown',
                data: data.content,
                badgeName: data.badgeName,
              },
              rejected: null,
            });
          },
        },
        {
          path: '/api/config',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            const configKey = new URL(request.url).searchParams.get(
              'configKey'
            );
            return HttpResponse.json(
              configKey === 'WORKFLOW_HOME_ENABLED' ? enabled : false
            );
          },
        },
      ],
    },
    {
      wrapper: ({ children }: { children: React.ReactNode }) => (
        <Suspense fallback={null}>{children}</Suspense>
      ),
    }
  );
  return { result, getQueryCalls: () => queryCalls };
}
