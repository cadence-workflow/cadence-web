import { Suspense } from 'react';

import { userEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';

import WorkflowQueries from '../workflow-queries';

jest.mock('../workflow-queries-tile/workflow-queries-tile', () =>
  jest.fn(({ name, onClick, runQuery }) => (
    <div onClick={onClick}>
      <div>Mock tile: {name}</div>
      <button onClick={runQuery}>Run</button>
    </div>
  ))
);

jest.mock('../workflow-queries-result-json/workflow-queries-result-json', () =>
  jest.fn(({ data }) => (
    <div>
      <div>Mock JSON</div>
      <div>{JSON.stringify(data)}</div>
    </div>
  ))
);

describe(WorkflowQueries.name, () => {
  it('renders without error and does not show excluded query type', async () => {
    await setup({});

    expect(await screen.findByText(/__open_sessions/)).toBeInTheDocument();
    expect(screen.queryByText(/__stack_trace/)).toBeNull();
  });

  it('runs query and updates JSON', async () => {
    const { user } = await setup({});

    const queryRunButtons = await screen.findAllByRole('button');
    expect(queryRunButtons).toHaveLength(1);

    await user.click(queryRunButtons[0]);

    expect(await screen.findByText(/"test_1"/)).toBeInTheDocument();
    expect(await screen.findByText(/"test_2"/)).toBeInTheDocument();
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
  const user = userEvent.setup();

  render(
    <Suspense>
      <WorkflowQueries
        params={{
          domain: 'mock-domain',
          cluster: 'mock-cluster',
          workflowId: 'mock-workflow-id',
          runId: 'mock-run-id',
          workflowTab: 'queries',
        }}
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
                  queryTypes: [
                    '__query_types',
                    '__open_sessions',
                    '__stack_trace',
                  ],
                } satisfies FetchWorkflowQueryTypesResponse,
              }),
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/:workflowId/:runId/query/:queryName',
          httpMethod: 'POST',
          jsonResponse: {
            result: ['test_1', 'test_2'],
            rejected: null,
          } satisfies QueryWorkflowResponse,
        },
      ],
    }
  );

  return { user };
}
