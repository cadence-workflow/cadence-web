import React from 'react';

import { userEvent } from '@testing-library/user-event';

import { render, screen } from '@/test-utils/rtl';

import DomainBatchActions from '../domain-batch-actions';

jest.mock('../domain-batch-actions.constants', () => ({
  MOCK_BATCH_ACTIONS: [
    { id: 5, status: 'running', progress: 60 },
    { id: 4, status: 'completed' },
    { id: 3, status: 'aborted' },
    { id: 2, status: 'failed' },
  ],
}));

jest.mock('react-icons/md', () => ({
  ...jest.requireActual('react-icons/md'),
  MdAdd: () => <div>Add Icon</div>,
  MdCheckCircle: () => <div>Check Icon</div>,
  MdOutlineCancel: () => <div>Cancel Icon</div>,
  MdWarning: () => <div>Warning Icon</div>,
}));

jest.mock('baseui/spinner', () => ({
  Spinner: jest.fn(() => <div>Spinner</div>),
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
    expect(screen.getByText('Abort')).toBeInTheDocument();
  });

  it('updates detail panel when a different action is selected', async () => {
    const user = userEvent.setup();

    render(<DomainBatchActions domain="test-domain" cluster="test-cluster" />);

    await user.click(screen.getByText('Batch action #4'));

    expect(
      screen.getByRole('heading', { name: /Batch action #4/ })
    ).toBeInTheDocument();
    expect(screen.queryByText('Abort')).not.toBeInTheDocument();
  });
});
