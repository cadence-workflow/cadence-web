import React from 'react';

import { HttpResponse } from 'msw';
import { Controller } from 'react-hook-form';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';
import { type CountWorkflowsResponse } from '@/views/shared/hooks/use-count-workflows.types';
import { mockWorkflowsListSystemColumns } from '@/views/shared/workflows-list/__fixtures__/mock-workflows-list-columns';

import { type Props as MSWMocksHandlersProps } from '../../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
import { BATCH_ACTION_DEFAULT_QUERY } from '../../domain-batch-actions.constants';
import DomainBatchActionsNewActionDetail from '../domain-batch-actions-new-action-detail';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdDeleteOutline: () => <div>Delete Icon</div>,
}));

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('query-string', () => ({
  stringifyUrl: jest.fn(({ url }: { url: string }) => url),
}));

// Render a real Controller-wired Description input so tests can make the form
// valid, while keeping the mock-params testid for isolation.
jest.mock(
  '../../domain-batch-actions-new-action-params/domain-batch-actions-new-action-params',
  () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return function MockParams({ control }: any) {
      return (
        <div data-testid="mock-params">
          <Controller
            name="description"
            control={control}
            render={({ field }: any) => (
              <input aria-label="Description" {...field} />
            )}
          />
        </div>
      );
    };
  }
);

jest.mock(
  '../../domain-batch-actions-new-action-floating-bar/domain-batch-actions-new-action-floating-bar',
  () =>
    jest.fn(
      ({ selectedCount, totalCount, actions, onActionClick, disabled }) => (
        <div data-testid="mock-floating-bar" data-disabled={String(disabled)}>
          <span>{`${selectedCount} of ${totalCount} workflows included`}</span>
          {actions.map((action: { id: string }) => (
            <button key={action.id} onClick={() => onActionClick(action.id)}>
              {`action-${action.id}`}
            </button>
          ))}
        </div>
      )
    )
);

jest.mock('@/components/error-panel/error-panel', () =>
  jest.fn(({ message }: { message: string }) => (
    <div data-testid="mock-error-panel">{message}</div>
  ))
);

const mockSetQueryParams = jest.fn();
const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

const mockUseWorkflowsListColumns = jest.fn();
jest.mock(
  '@/views/shared/workflows-list/hooks/use-workflows-list-columns',
  () => ({
    __esModule: true,
    default: (...args: Array<unknown>) => mockUseWorkflowsListColumns(...args),
  })
);

describe(DomainBatchActionsNewActionDetail.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePageQueryParams.mockReturnValue([
      { ...mockDomainPageQueryParamsValues, batchQuery: 'WorkflowType="foo"' },
      mockSetQueryParams,
    ]);
    mockUseWorkflowsListColumns.mockReturnValue({
      availableColumns: mockWorkflowsListSystemColumns,
      visibleColumns: mockWorkflowsListSystemColumns,
      selectedColumnIds: mockWorkflowsListSystemColumns.map((c) => c.id),
      setSelectedColumnIds: jest.fn(),
      resetColumns: jest.fn(),
    });
  });

  it('renders the "New batch action" title', async () => {
    setup({});

    expect(
      await screen.findByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();
  });

  it('renders the discard button and calls onDiscard when clicked', async () => {
    const onDiscard = jest.fn();
    const { user } = setup({ onDiscard });

    await user.click(await screen.findByText('Discard batch action'));

    expect(onDiscard).toHaveBeenCalledTimes(1);
  });

  it('renders the params input row', async () => {
    setup({});

    expect(await screen.findByTestId('mock-params')).toBeInTheDocument();
  });

  it('renders the columns selected for the workflows tab', async () => {
    mockUseWorkflowsListColumns.mockReturnValue({
      availableColumns: mockWorkflowsListSystemColumns,
      visibleColumns: [
        mockWorkflowsListSystemColumns.find((c) => c.id === 'WorkflowID')!,
        mockWorkflowsListSystemColumns.find((c) => c.id === 'CloseStatus')!,
        mockWorkflowsListSystemColumns.find((c) => c.id === 'StartTime')!,
      ],
      selectedColumnIds: ['WorkflowID', 'CloseStatus', 'StartTime'],
      setSelectedColumnIds: jest.fn(),
      resetColumns: jest.fn(),
    });
    setup({ workflowCount: 3 });

    expect(await screen.findByText('Workflow ID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Started')).toBeInTheDocument();
    expect(screen.queryByText('Run ID')).not.toBeInTheDocument();
    expect(screen.queryByText('Workflow Type')).not.toBeInTheDocument();
  });

  it('shows the floating bar with the count from the count API', async () => {
    setup({ workflowCount: 3, totalCount: 7 });

    expect(
      await screen.findByText(/7 of 7 workflows included/i)
    ).toBeInTheDocument();
  });

  it('shows total count from count API when available', async () => {
    setup({ workflowCount: 3, totalCount: 50 });

    expect(
      await screen.findByText(/50 of 50 workflows included/i)
    ).toBeInTheDocument();
  });

  it('shows error panel when count API fails', async () => {
    setup({ workflowCount: 3, countError: true });

    expect(
      await screen.findByText('Failed to fetch workflows')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('mock-floating-bar')).not.toBeInTheDocument();
  });

  it('hides the floating bar when no workflows have been fetched', async () => {
    setup({ workflowCount: 0, totalCount: 0 });

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.queryByText(/workflows included/i)).not.toBeInTheDocument();
  });

  it('shows the running-workflows caption when the query is the default', async () => {
    setQueryParams({ batchQuery: BATCH_ACTION_DEFAULT_QUERY });
    setup({});

    expect(
      await screen.findByText(/Showing all running workflows/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Query must not be empty')
    ).not.toBeInTheDocument();
  });

  it('hides the caption once the query has been edited', async () => {
    setQueryParams({ batchQuery: 'WorkflowType="foo"' });
    setup({});

    expect(await screen.findByTestId('mock-floating-bar')).toBeInTheDocument();
    expect(
      screen.queryByText(/Showing all running workflows/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Query must not be empty')
    ).not.toBeInTheDocument();
  });

  it('shows the required-query error and blocks the action when the query is empty', async () => {
    setQueryParams({ batchQuery: '' });
    const { user } = setup({});

    await user.click(await screen.findByText('action-cancel'));

    expect(
      await screen.findByText('Query must not be empty')
    ).toBeInTheDocument();
    // The confirmation modal must not open for an empty query.
    expect(screen.queryByText('Start Batch Action')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Showing all running workflows/i)
    ).not.toBeInTheDocument();
  });

  it('blocks submission when the description is valid but the query is empty', async () => {
    setQueryParams({ batchQuery: '' });
    const { user } = setup({});

    await user.type(await screen.findByLabelText('Description'), 'cleanup');
    await user.click(screen.getByText('action-cancel'));

    expect(
      await screen.findByText('Query must not be empty')
    ).toBeInTheDocument();
    expect(screen.queryByText('Start Batch Action')).not.toBeInTheDocument();
  });

  it('disables the floating bar after an empty-query action attempt', async () => {
    setQueryParams({ batchQuery: '' });
    const { user } = setup({});

    expect(await screen.findByTestId('mock-floating-bar')).toHaveAttribute(
      'data-disabled',
      'false'
    );

    await user.click(screen.getByText('action-cancel'));

    expect(screen.getByTestId('mock-floating-bar')).toHaveAttribute(
      'data-disabled',
      'true'
    );
  });

  it('opens the confirmation modal when the query and description are valid', async () => {
    setQueryParams({ batchQuery: 'WorkflowType="foo"' });
    const { user } = setup({});

    await user.type(await screen.findByLabelText('Description'), 'cleanup');
    await user.click(screen.getByText('action-cancel'));

    expect(await screen.findByText('Start Batch Action')).toBeInTheDocument();
  });

  it('closes the confirmation modal without starting the action', async () => {
    setQueryParams({ batchQuery: 'WorkflowType="foo"' });
    const { user } = setup({});

    await user.type(await screen.findByLabelText('Description'), 'cleanup');
    await user.click(screen.getByText('action-cancel'));
    await user.click(await screen.findByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText('Start Batch Action')).not.toBeInTheDocument();
    });
  });

  it('starts the batch action and closes the modal on success when confirmed', async () => {
    setQueryParams({ batchQuery: 'WorkflowType="foo"' });
    const { user } = setup({});

    await user.type(await screen.findByLabelText('Description'), 'cleanup');
    await user.click(screen.getByText('action-cancel'));
    await user.click(await screen.findByText('Start Batch Action'));

    // A successful start triggers onSuccess -> setActiveAction(null), closing
    // the modal.
    await waitFor(() => {
      expect(screen.queryByText('Start Batch Action')).not.toBeInTheDocument();
    });
  });

  describe('Select mode', () => {
    it('renders the "Select" toggle segment', async () => {
      setQueryParams({ batchInputType: 'search' });
      setup({ workflowCount: 2, totalCount: 5 });

      expect(await screen.findByText('Select')).toBeInTheDocument();
    });

    it('renders checkboxes and a disabled bar when nothing is selected', async () => {
      setQueryParams({ batchInputType: 'search' });
      setup({ workflowCount: 2, totalCount: 5 });

      expect(
        await screen.findByRole('checkbox', { name: 'Select all workflows' })
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/0 of 5 workflows included/i)
      ).toBeInTheDocument();
      expect(screen.getByTestId('mock-floating-bar')).toHaveAttribute(
        'data-disabled',
        'true'
      );
    });

    it('selecting a row updates the count and enables the bar', async () => {
      setQueryParams({ batchInputType: 'search' });
      const { user } = setup({ workflowCount: 2, totalCount: 5 });

      await user.click(
        await screen.findByRole('checkbox', {
          name: 'Select workflow wf-0 run run-0',
        })
      );

      expect(
        await screen.findByText(/1 of 5 workflows included/i)
      ).toBeInTheDocument();
      expect(screen.getByTestId('mock-floating-bar')).toHaveAttribute(
        'data-disabled',
        'false'
      );
    });

    it('select all selects every workflow and disables row checkboxes', async () => {
      setQueryParams({ batchInputType: 'search' });
      const { user } = setup({ workflowCount: 2, totalCount: 5 });

      await user.click(
        await screen.findByRole('checkbox', { name: 'Select all workflows' })
      );

      expect(
        await screen.findByText(/5 of 5 workflows included/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('checkbox', { name: 'Select workflow wf-0 run run-0' })
      ).toBeDisabled();
    });

    it('submits a query built from the individually selected workflows', async () => {
      setQueryParams({ batchInputType: 'search' });
      const { user, startBodies } = setup({ workflowCount: 2, totalCount: 5 });

      await user.click(
        await screen.findByRole('checkbox', {
          name: 'Select workflow wf-0 run run-0',
        })
      );
      await user.type(await screen.findByLabelText('Description'), 'cleanup');
      await user.click(screen.getByText('action-cancel'));
      await user.click(await screen.findByText('Start Batch Action'));

      await waitFor(() => expect(startBodies).toHaveLength(1));
      expect(startBodies[0].input[0].Query).toBe('(RunID = "run-0")');
    });

    it('submits the matching-set query when select all is active', async () => {
      setQueryParams({
        batchInputType: 'search',
        batchSearch: 'foo',
        batchTimeRangeEnd: undefined,
      });
      const { user, startBodies } = setup({ workflowCount: 2, totalCount: 5 });

      await user.click(
        await screen.findByRole('checkbox', { name: 'Select all workflows' })
      );
      await user.type(await screen.findByLabelText('Description'), 'cleanup');
      await user.click(screen.getByText('action-cancel'));
      await user.click(await screen.findByText('Start Batch Action'));

      await waitFor(() => expect(startBodies).toHaveLength(1));
      expect(startBodies[0].input[0].Query).toBe(
        '(WorkflowType = "foo" OR WorkflowID = "foo" OR RunID = "foo")'
      );
    });
  });
});

function setQueryParams(overrides: Record<string, unknown>) {
  mockUsePageQueryParams.mockReturnValue([
    { ...mockDomainPageQueryParamsValues, ...overrides },
    mockSetQueryParams,
  ]);
}

function setup({
  onDiscard = jest.fn(),
  workflowCount = 1,
  totalCount = 100,
  countError = false,
}: {
  onDiscard?: () => void;
  workflowCount?: number;
  totalCount?: number;
  countError?: boolean;
}) {
  const user = userEvent.setup();
  const response: ListWorkflowsResponse = {
    workflows: Array.from({ length: workflowCount }, (_, i) =>
      getMockWorkflowListItem({
        workflowID: `wf-${i}`,
        runID: `run-${i}`,
      })
    ),
    nextPage: '',
  };

  const countResponse: CountWorkflowsResponse = {
    count: totalCount,
  };

  // Only the generated batch Query is asserted on in select-mode tests.
  const startBodies: Array<{ input: Array<{ Query: string }> }> = [];

  render(
    <DomainBatchActionsNewActionDetail
      domain="test-domain"
      cluster="test-cluster"
      onDiscard={onDiscard}
    />,
    {
      endpointsMocks: [
        {
          path: '/api/domains/:domain/:cluster/workflows',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () => HttpResponse.json(response),
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/count',
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async () =>
            countError
              ? HttpResponse.json(
                  { message: 'Internal error' },
                  { status: 500 }
                )
              : HttpResponse.json(countResponse),
        },
        {
          path: '/api/domains/:domain/:cluster/workflows/start',
          httpMethod: 'POST',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            startBodies.push(
              (await request.json()) as { input: Array<{ Query: string }> }
            );
            return HttpResponse.json({ workflowId: 'b-wf', runId: 'b-run' });
          },
        },
      ] as MSWMocksHandlersProps['endpointsMocks'],
    }
  );

  return { user, startBodies };
}
