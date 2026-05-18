import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import { mockDomainPageQueryParamsValues } from '@/views/domain-page/__fixtures__/domain-page-query-params';

import DomainBatchActions from '../domain-batch-actions';
import { type Props as NewActionDetailProps } from '../domain-batch-actions-new-action-detail/domain-batch-actions-new-action-detail.types';
import { type Props as SidebarProps } from '../domain-batch-actions-sidebar/domain-batch-actions-sidebar.types';

const mockSetQueryParams = jest.fn();
const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

jest.mock('../domain-batch-actions.constants', () => ({
  DRAFT_ACTION_ID: 'draft',
  MOCK_BATCH_ACTIONS: [
    {
      id: '5',
      status: 'running',
      progress: 60,
      actionType: 'cancel',
      startTime: Date.now() - 100000,
      rps: 200,
      concurrency: 10,
    },
    {
      id: '4',
      status: 'completed',
      actionType: 'terminate',
      startTime: Date.now() - 3600000,
      endTime: Date.now() - 1800000,
      rps: 150,
      concurrency: 5,
    },
    {
      id: '3',
      status: 'failed',
      actionType: 'reset',
      startTime: Date.now() - 7200000,
      endTime: Date.now() - 5400000,
      rps: 100,
      concurrency: 8,
    },
  ],
}));

jest.mock(
  '../domain-batch-actions-new-action-detail/domain-batch-actions-new-action-detail',
  () => ({
    __esModule: true,
    default: ({ onDiscard }: NewActionDetailProps) => (
      <div>
        <h2>New batch action</h2>
        <button onClick={onDiscard}>Discard batch action</button>
      </div>
    ),
  })
);

jest.mock(
  '../domain-batch-actions-sidebar/domain-batch-actions-sidebar',
  () => ({
    __esModule: true,
    default: ({
      batchActions,
      onSelectAction,
      onSelectDraft,
      onCreateNew,
    }: SidebarProps) => (
      <div>
        <button onClick={onCreateNew}>mock-new-batch-action</button>
        <button onClick={onSelectDraft}>mock-select-draft</button>
        {batchActions.map((a) => (
          <button key={a.id} onClick={() => onSelectAction(a.id)}>
            mock-select-{a.id}
          </button>
        ))}
      </div>
    ),
  })
);

describe(DomainBatchActions.name, () => {
  beforeEach(() => {
    mockSetQueryParams.mockClear();
    mockUsePageQueryParams.mockReturnValue([
      { ...mockDomainPageQueryParamsValues, batchQuery: '' },
      mockSetQueryParams,
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders detail panel for the first batch action by default', () => {
    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    expect(
      screen.getByRole('heading', { name: /Batch action #5/ })
    ).toBeInTheDocument();
    expect(screen.getByText('Abort batch action')).toBeInTheDocument();
  });

  it('updates URL param when a different action is selected', async () => {
    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('mock-select-4'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({ batchActionId: '4' });
  });

  it('sets batchActionId to draft when "New batch action" is clicked', async () => {
    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('mock-new-batch-action'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      batchActionId: 'draft',
    });
  });

  it('clears batchActionId and batchQuery on discard', async () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        batchActionId: 'draft',
        batchQuery: 'WorkflowType="foo"',
      },
      mockSetQueryParams,
    ]);

    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('Discard batch action'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      batchActionId: undefined,
      batchQuery: '',
    });
  });

  it('opens the draft on mount when batchQuery is present in the URL', () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        batchQuery: 'WorkflowType="foo"',
      },
      mockSetQueryParams,
    ]);

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    expect(
      screen.getByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Batch action #5/ })
    ).not.toBeInTheDocument();
  });

  it('opens the draft when batchActionId is "draft" (no batchQuery)', () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        batchActionId: 'draft',
        batchQuery: '',
      },
      mockSetQueryParams,
    ]);

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    expect(
      screen.getByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();
  });

  it('renders the specified batch action when batchActionId is set', () => {
    mockUsePageQueryParams.mockReturnValue([
      {
        ...mockDomainPageQueryParamsValues,
        batchActionId: '4',
        batchQuery: '',
      },
      mockSetQueryParams,
    ]);

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    expect(
      screen.getByRole('heading', { name: /Batch action #4/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Batch action #5/ })
    ).not.toBeInTheDocument();
  });

  it('sets batchActionId to draft when selecting the draft sidebar item', async () => {
    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('mock-select-draft'));

    expect(mockSetQueryParams).toHaveBeenCalledWith({
      batchActionId: 'draft',
    });
  });
});
