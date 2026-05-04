import React from 'react';

import { HttpResponse } from 'msw';

import { render, screen, userEvent, waitFor } from '@/test-utils/rtl';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import { type Props as MSWMocksHandlersProps } from '../../../../test-utils/msw-mock-handlers/msw-mock-handlers.types';
import DomainBatchActionsNewActionDetail from '../domain-batch-actions-new-action-detail';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdDeleteOutline: () => <div>Delete Icon</div>,
}));

jest.mock('query-string', () => ({
  stringifyUrl: jest.fn(
    () => '/api/domains/test-domain/test-cluster/workflows'
  ),
}));

const mockSetQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () =>
  jest.fn(() => [mockDomainPageQueryParamsValues, mockSetQueryParams])
);

const mockUseWorkflowsListColumns = jest.fn();
jest.mock(
  '@/views/shared/workflows-list/hooks/use-workflows-list-columns',
  () => ({
    __esModule: true,
    default: (...args: Array<unknown>) => mockUseWorkflowsListColumns(...args),
  })
);

const mockAvailableColumns = [
  {
    id: 'WorkflowID',
    name: 'Workflow ID',
    width: '1fr',
    isSystem: true,
    renderCell: () => 'wf-id-cell',
  },
  {
    id: 'CloseStatus',
    name: 'Status',
    width: '1fr',
    isSystem: true,
    renderCell: () => 'status-cell',
  },
  {
    id: 'RunID',
    name: 'Run ID',
    width: '1fr',
    isSystem: true,
    renderCell: () => 'run-id-cell',
  },
  {
    id: 'WorkflowType',
    name: 'Workflow Type',
    width: '1fr',
    isSystem: true,
    renderCell: () => 'wf-type-cell',
  },
  {
    id: 'StartTime',
    name: 'Started',
    width: '1fr',
    isSystem: true,
    sortable: true,
    renderCell: () => 'start-time-cell',
  },
];

describe(DomainBatchActionsNewActionDetail.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWorkflowsListColumns.mockReturnValue({
      availableColumns: mockAvailableColumns,
      visibleColumns: mockAvailableColumns,
      selectedColumnIds: mockAvailableColumns.map((c) => c.id),
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

  it('renders the 4-column subset (Run ID, Status, Workflow ID, Workflow Type)', async () => {
    setup({ workflowCount: 3 });

    expect(await screen.findByText('Run ID')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Workflow ID')).toBeInTheDocument();
    expect(screen.getByText('Workflow Type')).toBeInTheDocument();
    expect(screen.queryByText('Started')).not.toBeInTheDocument();
  });

  it('shows the floating bar with the fetched workflow count', async () => {
    setup({ workflowCount: 7 });

    expect(
      await screen.findByText(/7 of 7 workflows included/i)
    ).toBeInTheDocument();
  });

  it('hides the floating bar when no workflows have been fetched', async () => {
    setup({ workflowCount: 0 });

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(screen.queryByText(/workflows included/i)).not.toBeInTheDocument();
  });
});

function setup({
  onDiscard = jest.fn(),
  workflowCount = 1,
}: {
  onDiscard?: () => void;
  workflowCount?: number;
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
      ] as MSWMocksHandlersProps['endpointsMocks'],
    }
  );

  return { user };
}
