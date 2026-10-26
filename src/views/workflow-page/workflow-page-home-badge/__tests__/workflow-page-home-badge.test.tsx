import React, { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, waitFor } from '@/test-utils/rtl';

import { WORKFLOW_HOME_QUERY_NAME } from '@/views/workflow-home/workflow-home.constants';

import { mockDescribeWorkflowResponse } from '../../__fixtures__/describe-workflow-response';
import WorkflowPageHomeBadge from '../workflow-page-home-badge';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: () => ({
    domain: 'mock-domain',
    cluster: 'mock-cluster',
    workflowId: 'mock-workflow-id',
    runId: 'mock-run-id',
  }),
}));

describe(WorkflowPageHomeBadge.name, () => {
  it('renders the badge when the page has a badge', async () => {
    setup({ data: { content: '# Hi', badgeName: 'Expense 1' } });

    expect(await screen.findByText('Expense 1')).toBeInTheDocument();
  });

  it('renders nothing when the page has no badge', async () => {
    const { getQueryCalls } = setup({ data: { content: '# Hi' } });

    await waitFor(() => expect(getQueryCalls()).toBe(1));
    expect(screen.queryByText('Expense 1')).toBeNull();
  });

  it('renders nothing when the feature is disabled', async () => {
    const { getQueryCalls } = setup({
      enabled: false,
      data: { content: '# Hi', badgeName: 'Expense 1' },
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(getQueryCalls()).toBe(0);
    expect(screen.queryByText('Expense 1')).toBeNull();
  });

  it('renders nothing when the query fails', async () => {
    const { getQueryCalls } = setup({});

    await waitFor(() => expect(getQueryCalls()).toBe(1));
    expect(screen.queryByText('Expense 1')).toBeNull();
  });
});

function setup({
  data,
  enabled = true,
}: {
  data?: { content: string; badgeName?: string };
  enabled?: boolean;
}) {
  let queryCalls = 0;
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowPageHomeBadge />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId',
          httpMethod: 'GET',
          mockOnce: false,
          jsonResponse: mockDescribeWorkflowResponse,
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
    }
  );
  return { getQueryCalls: () => queryCalls };
}
