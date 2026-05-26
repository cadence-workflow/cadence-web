import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';
import { type CountWorkflowsResponse } from '@/views/shared/hooks/use-count-workflows.types';
import { mockWorkflowsListSystemColumns } from '@/views/shared/workflows-list/__fixtures__/mock-workflows-list-columns';

import { type Props as MSWMocksHandlersProps } from '../../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
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

jest.mock(
  '../../domain-batch-actions-new-action-params/domain-batch-actions-new-action-params',
  () => jest.fn(() => <div data-testid="mock-params" />)
);

jest.mock(
  '../../domain-batch-actions-new-action-floating-bar/domain-batch-actions-new-action-floating-bar',
  () =>
    jest.fn(({ selectedCount, totalCount }) => (
      <div data-testid="mock-floating-bar">
        {`${selectedCount} of ${totalCount} workflows included`}
      </div>
    ))
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
});

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
      ] as MSWMocksHandlersProps['endpointsMocks'],
    }
  );

  return { user };
}
