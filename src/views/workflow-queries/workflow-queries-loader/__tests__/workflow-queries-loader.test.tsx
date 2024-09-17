import { Suspense } from 'react';

import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';

import WorkflowQueriesLoader from '../workflow-queries-loader';

describe(WorkflowQueriesLoader.name, () => {
  it('WIP: renders query types without error', async () => {
    await setup({});

    expect(await screen.findByText(/__query_types/)).toBeInTheDocument();
  });

  it('does not render if the initial call fails', async () => {
    let renderErrorMessage;
    try {
      await act(async () => {
        await setup({ error: true });
      });
    } catch (error) {
      if (error instanceof Error) {
        renderErrorMessage = error.message;
      }
    }

    expect(renderErrorMessage).toEqual('Failed to fetch query types');
  });
});

async function setup({ error }: { error?: boolean }) {
  render(
    <Suspense>
      <WorkflowQueriesLoader
        domain="mock-domain"
        cluster="mock-cluster"
        workflowId="mock-workflow-id"
        runId="mock-run-id"
      />
    </Suspense>,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query',
          httpMethod: 'GET',
          ...(error
            ? {
                httpResolver: () => {
                  return HttpResponse.json(
                    { message: 'Failed to fetch query types' },
                    { status: 500 }
                  );
                },
              }
            : {
                jsonResponse: {
                  queryTypes: ['__query_types', '__open_sessions'],
                } satisfies FetchWorkflowQueryTypesResponse,
              }),
        },
      ],
    }
  );
}
