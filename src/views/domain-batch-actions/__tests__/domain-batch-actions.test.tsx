import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import { type Props as SidebarProps } from '../domain-batch-actions-sidebar/domain-batch-actions-sidebar.types';
import DomainBatchActions from '../domain-batch-actions';

jest.mock('../domain-batch-actions.constants', () => ({
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

  it('updates detail panel when a different action is selected', async () => {
    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('mock-select-4'));

    expect(
      screen.getByRole('heading', { name: /Batch action #4/ })
    ).toBeInTheDocument();
    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('opens the draft detail panel when "New batch action" is clicked', async () => {
    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('mock-new-batch-action'));

    expect(
      screen.getByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();
    expect(screen.getByText('Discard batch action')).toBeInTheDocument();
  });

  it('returns to the previously selected action detail when discarded', async () => {
    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('mock-new-batch-action'));
    expect(
      screen.getByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();

    await user.click(screen.getByText('Discard batch action'));

    expect(
      screen.queryByRole('heading', { name: 'New batch action' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Batch action #5/ })
    ).toBeInTheDocument();
  });
});
