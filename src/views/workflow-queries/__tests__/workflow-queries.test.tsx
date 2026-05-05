import { Suspense } from 'react';

import { userEvent } from '@testing-library/user-event';
import { HttpResponse } from 'msw';

import { render, screen, act } from '@/test-utils/rtl';

import usePageQueryParams from '@/hooks/use-page-query-params/use-page-query-params';
import { type FetchWorkflowQueryTypesResponse } from '@/route-handlers/fetch-workflow-query-types/fetch-workflow-query-types.types';
import { type QueryWorkflowResponse } from '@/route-handlers/query-workflow/query-workflow.types';

import WorkflowQueries from '../workflow-queries';

jest.mock('@/hooks/use-page-query-params/use-page-query-params');

const mockSetQueryParams = jest.fn();
const mockUsePageQueryParams = usePageQueryParams as jest.MockedFunction<
  typeof usePageQueryParams
>;

jest.mock('../workflow-queries-tile/workflow-queries-tile', () =>
  jest.fn(({ name, onClick, runQuery, isSelected }) => (
    <div onClick={onClick} data-selected={isSelected}>
      <div>Mock tile: {name}</div>
      <button onClick={runQuery}>Run</button>
    </div>
  ))
);

jest.mock('../workflow-queries-result/workflow-queries-result', () =>
  jest.fn(({ data, domain, cluster, workflowId, runId }) => (
    <div>
      <div>Mock JSON</div>
      <div>{JSON.stringify(data)}</div>
      <div>
        Domain: {domain}, Cluster: {cluster}, WorkflowId: {workflowId}, RunId:{' '}
        {runId}
      </div>
    </div>
  ))
);

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => <div>{message}</div>)
);

jest.mock('../config/workflow-queries-empty-panel.config', () => ({
  message: 'No queries available',
}));

describe(WorkflowQueries.name, () => {
  it('renders without error and does not show excluded query type', async () => {
    await setup({});

    expect(await screen.findByText(/__open_sessions/)).toBeInTheDocument();
    expect(screen.queryByText(/__stack_trace/)).toBeNull();
  });

  it('renders with error panel if there are no query types available', async () => {
    await setup({ noQueries: true });

    expect(await screen.findByText('No queries available'));
  });

  it('runs query and updates JSON', async () => {
    const { user } = await setup({
      selectedQueryName: '__open_sessions',
    });

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

  it('selects the correct tile when a query name is in the URL', async () => {
    await setup({ selectedQueryName: '__open_sessions' });

    const tiles = await screen.findAllByText(/Mock tile:/);
    expect(tiles).toHaveLength(1);

    const tile = tiles[0].closest('[data-selected]');
    expect(tile).toHaveAttribute('data-selected', 'true');
  });

  it('does not select any tile when the URL query name is invalid', async () => {
    await setup({ selectedQueryName: 'non_existent_query' });

    const tiles = await screen.findAllByText(/Mock tile:/);
    expect(tiles).toHaveLength(1);

    const tile = tiles[0].closest('[data-selected]');
    expect(tile).toHaveAttribute('data-selected', 'false');
  });

  it('updates URL query param when a tile is clicked', async () => {
    const { user } = await setup({});

    const tile = await screen.findByText(/Mock tile: __open_sessions/);
    await user.click(tile);

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      selectedQueryName: '__open_sessions',
    });
  });

  it('auto-runs query when arriving via deep link', async () => {
    await setup({ selectedQueryName: '__open_sessions' });

    expect(await screen.findByText(/"test_1"/)).toBeInTheDocument();
    expect(await screen.findByText(/"test_2"/)).toBeInTheDocument();
  });
});

async function setup({
  error,
  noQueries,
  selectedQueryName,
}: {
  error?: boolean;
  noQueries?: boolean;
  selectedQueryName?: string;
}) {
  const user = userEvent.setup();

  mockUsePageQueryParams.mockReturnValue([
    { selectedQueryName } as any,
    mockSetQueryParams as any,
  ]);

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
                  queryTypes: noQueries
                    ? []
                    : ['__query_types', '__open_sessions', '__stack_trace'],
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
