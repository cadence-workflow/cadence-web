import { Suspense } from 'react';

import { userEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';

import WorkflowQueriesLoader from '../workflow-queries-loader';

jest.mock('../../workflow-queries-tile/workflow-queries-tile', () =>
  jest.fn(({ name, onClick, runQuery }) => (
    <div onClick={onClick}>
      <div>Mock tile: {name}</div>
      <button onClick={runQuery}>Run</button>
    </div>
  ))
);

jest.mock(
  '../../workflow-queries-result-json/workflow-queries-result-json',
  () =>
    jest.fn(({ data }) => (
      <div>
        <div>Mock JSON</div>
        <div>{JSON.stringify(data)}</div>
      </div>
    ))
);

describe(WorkflowQueriesLoader.name, () => {
  it('renders without error', async () => {
    await setup({});

    expect(await screen.findByText(/__open_sessions/)).toBeInTheDocument();
  });

  it('runs query and updates JSON', async () => {
    const { user } = await setup({});

    const queryRunButtons = await screen.findAllByRole('button');
    expect(queryRunButtons).toHaveLength(2);

    await user.click(queryRunButtons[1]);

    expect(
      await screen.findByText(/{"name":"__open_sessions"}/)
    ).toBeInTheDocument();
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

  return { user };
}
