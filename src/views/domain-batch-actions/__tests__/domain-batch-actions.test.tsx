import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import DomainBatchActions from '../domain-batch-actions';

jest.mock('../domain-batch-actions.constants', () => ({
  MOCK_BATCH_ACTIONS: [
    {
      id: 5,
      status: 'running',
      progress: 60,
      actionType: 'cancel',
      startTime: Date.now() - 100000,
      rps: 200,
      concurrency: 10,
    },
    {
      id: 4,
      status: 'completed',
      actionType: 'terminate',
      startTime: Date.now() - 3600000,
      endTime: Date.now() - 1800000,
      rps: 150,
      concurrency: 5,
    },
    {
      id: 3,
      status: 'failed',
      actionType: 'reset',
      startTime: Date.now() - 7200000,
      endTime: Date.now() - 5400000,
      rps: 100,
      concurrency: 8,
    },
  ],
}));

describe(DomainBatchActions.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders sidebar with batch actions', () => {
    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    expect(screen.getByText('Batch history')).toBeInTheDocument();
    expect(screen.getByText('New batch action')).toBeInTheDocument();
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

    await user.click(screen.getByText('Batch action #4'));

    expect(
      screen.getByRole('heading', { name: /Batch action #4/ })
    ).toBeInTheDocument();
    expect(screen.queryByText('Abort batch action')).not.toBeInTheDocument();
  });

  it('opens a draft when "New batch action" is clicked', async () => {
    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('New batch action'));

    expect(screen.getByText('Untitled batch action')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'New batch action' })
    ).toBeInTheDocument();
    expect(screen.getByText('Discard batch action')).toBeInTheDocument();
  });

  it('removes the draft and selects the most recent saved action when discarded', async () => {
    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('New batch action'));
    expect(screen.getByText('Untitled batch action')).toBeInTheDocument();

    await user.click(screen.getByText('Discard batch action'));

    expect(screen.queryByText('Untitled batch action')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Batch action #5/ })
    ).toBeInTheDocument();
  });
});
