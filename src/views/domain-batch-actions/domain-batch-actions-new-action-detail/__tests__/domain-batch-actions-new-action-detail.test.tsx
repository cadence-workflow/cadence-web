import React from 'react';

import { render, screen, userEvent } from '@/test-utils/rtl';

import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';
import DomainWorkflowsHeader from '@/views/domain-workflows/domain-workflows-header/domain-workflows-header';
import DomainWorkflowsList from '@/views/domain-workflows/domain-workflows-list/domain-workflows-list';
import { type WorkflowsListColumn } from '@/views/shared/workflows-list/workflows-list.types';

import DomainBatchActionsNewActionFloatingBar from '../../domain-batch-actions-new-action-floating-bar/domain-batch-actions-new-action-floating-bar';
import DomainBatchActionsNewActionDetail from '../domain-batch-actions-new-action-detail';
import { BATCH_ACTIONS_NEW_ACTION_VISIBLE_COLUMN_IDS } from '../domain-batch-actions-new-action-detail.constants';

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdDeleteOutline: () => <div>Delete Icon</div>,
}));

const mockSetQueryParams = jest.fn();
const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

jest.mock(
  '@/views/domain-workflows/domain-workflows-header/domain-workflows-header',
  () => jest.fn(() => <div data-testid="mock-domain-workflows-header" />)
);

jest.mock(
  '@/views/domain-workflows/domain-workflows-list/domain-workflows-list',
  () => jest.fn(() => <div data-testid="mock-domain-workflows-list" />)
);

jest.mock(
  '../../domain-batch-actions-new-action-floating-bar/domain-batch-actions-new-action-floating-bar',
  () => jest.fn(() => <div data-testid="mock-floating-bar" />)
);

const mockAvailableColumns: Array<WorkflowsListColumn> = [
  {
    id: 'WorkflowID',
    name: 'Workflow ID',
    width: '1fr',
    isSystem: true,
    renderCell: () => null,
  },
  {
    id: 'CloseStatus',
    name: 'Status',
    width: '1fr',
    isSystem: true,
    renderCell: () => null,
  },
  {
    id: 'RunID',
    name: 'Run ID',
    width: '1fr',
    isSystem: true,
    renderCell: () => null,
  },
  {
    id: 'WorkflowType',
    name: 'Workflow Type',
    width: '1fr',
    isSystem: true,
    renderCell: () => null,
  },
  {
    id: 'StartTime',
    name: 'Started',
    width: '1fr',
    isSystem: true,
    sortable: true,
    renderCell: () => null,
  },
];

const mockUseWorkflowsListColumns = jest.fn();
jest.mock(
  '@/views/shared/workflows-list/hooks/use-workflows-list-columns',
  () => ({
    __esModule: true,
    default: (...args: Array<unknown>) => mockUseWorkflowsListColumns(...args),
  })
);

const mockUseListWorkflows = jest.fn();
jest.mock('@/views/shared/hooks/use-list-workflows', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUseListWorkflows(...args),
}));

describe(DomainBatchActionsNewActionDetail.name, () => {
  beforeEach(() => {
    mockUsePageQueryParams.mockReturnValue([
      mockDomainPageQueryParamsValues,
      mockSetQueryParams,
    ]);
    mockUseWorkflowsListColumns.mockReturnValue({
      availableColumns: mockAvailableColumns,
      visibleColumns: mockAvailableColumns,
      selectedColumnIds: mockAvailableColumns.map((c) => c.id),
      setSelectedColumnIds: jest.fn(),
      resetColumns: jest.fn(),
    });
    mockUseListWorkflows.mockReturnValue({
      workflows: [{ workflowID: 'wf-0', runID: 'run-0' }],
      error: null,
      isLoading: false,
      isFetching: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "New batch action" title', () => {
    setup({});

    expect(
      screen.getByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();
  });

  it('renders the discard button', () => {
    setup({});

    expect(screen.getByText('Discard batch action')).toBeInTheDocument();
  });

  it('calls onDiscard when the discard button is clicked', async () => {
    const onDiscard = jest.fn();
    const { user } = setup({ onDiscard });

    await user.click(screen.getByText('Discard batch action'));

    expect(onDiscard).toHaveBeenCalledTimes(1);
  });

  it('renders the workflows header with showQueryInputOnly, noSpacing, batch URL keys, and no columns picker', () => {
    setup({});

    expect(jest.mocked(DomainWorkflowsHeader)).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: 'test-domain',
        cluster: 'test-cluster',
        showQueryInputOnly: true,
        noSpacing: true,
        inputTypeQueryParamKey: 'batchInputType',
        queryStringQueryParamKey: 'batchQuery',
      }),
      expect.anything()
    );
    const headerProps = jest.mocked(DomainWorkflowsHeader).mock.calls[0][0];
    expect(headerProps.columnsPickerProps).toBeUndefined();
  });

  it('renders the workflows list with the fixed 4-column subset and batch URL keys', () => {
    setup({});

    expect(jest.mocked(DomainWorkflowsList)).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: 'test-domain',
        cluster: 'test-cluster',
        inputTypeQueryParamKey: 'batchInputType',
        queryStringQueryParamKey: 'batchQuery',
        visibleColumns: BATCH_ACTIONS_NEW_ACTION_VISIBLE_COLUMN_IDS.map((id) =>
          expect.objectContaining({ id })
        ),
      }),
      expect.anything()
    );
  });

  it('forwards the fetched workflow count to the floating bar', () => {
    mockUseListWorkflows.mockReturnValue({
      workflows: Array.from({ length: 7 }, (_, i) => ({
        workflowID: `wf-${i}`,
        runID: `run-${i}`,
      })),
      error: null,
      isLoading: false,
      isFetching: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      refetch: jest.fn(),
    });
    setup({});

    expect(
      jest.mocked(DomainBatchActionsNewActionFloatingBar)
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedCount: 7,
        totalCount: 7,
      }),
      expect.anything()
    );
  });

  it('hides the floating bar when no workflows have been fetched', () => {
    mockUseListWorkflows.mockReturnValue({
      workflows: [],
      error: null,
      isLoading: false,
      isFetching: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      isFetchingNextPage: false,
      refetch: jest.fn(),
    });
    setup({});

    expect(screen.queryByTestId('mock-floating-bar')).not.toBeInTheDocument();
  });

  it('seeds batchQuery from query on mount when batchQuery is empty', () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        query: 'WorkflowType="foo"',
        batchQuery: '',
      },
      mockSetQueryParams,
    ]);
    setup({});

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      batchQuery: 'WorkflowType="foo"',
    });
  });

  it('does not seed batchQuery when it is already set', () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        query: 'WorkflowType="foo"',
        batchQuery: 'WorkflowType="bar"',
      },
      mockSetQueryParams,
    ]);
    setup({});

    expect(mockSetQueryParams).not.toHaveBeenCalled();
  });
});

function setup({ onDiscard = jest.fn() }: { onDiscard?: () => void }) {
  const user = userEvent.setup();
  render(
    <DomainBatchActionsNewActionDetail
      domain="test-domain"
      cluster="test-cluster"
      onDiscard={onDiscard}
    />
  );

  return { user };
}
