import React from 'react';

import { render, screen } from '@/test-utils/rtl';

import WorkflowHistoryEventStatusBadge from '../workflow-history-event-status-badge';
import type { Props } from '../workflow-history-event-status-badge.types';

jest.mock('baseui/badge', () => ({
  Badge: jest.fn(({ content, hierarchy, color }) => (
    <div data-testid="badge" data-hierarchy={hierarchy} data-color={color}>
      {content}
    </div>
  )),
}));

jest.mock('baseui/skeleton', () => ({
  Skeleton: jest.fn(() => <div data-testid="skeleton" />),
}));

jest.mock('../../config/workflow-history-event-status-badges.config', () => ({
  __esModule: true,
  default: {
    COMPLETED: {
      icon: ({ size }: { size?: number }) => (
        <span data-testid="icon-completed" data-size={size}>
          CompletedIcon
        </span>
      ),
      hierarchy: 'secondary',
      color: 'positive',
    },
    FAILED: {
      icon: ({ size }: { size?: number }) => (
        <span data-testid="icon-failed" data-size={size}>
          FailedIcon
        </span>
      ),
      hierarchy: 'primary',
      color: 'negative',
    },
    CANCELED: {
      icon: ({ size }: { size?: number }) => (
        <span data-testid="icon-canceled" data-size={size}>
          CanceledIcon
        </span>
      ),
      hierarchy: 'secondary',
      color: 'negative',
    },
    ONGOING: {
      icon: ({ size }: { size?: number }) => (
        <span data-testid="icon-ongoing" data-size={size}>
          OngoingIcon
        </span>
      ),
      hierarchy: 'primary',
      color: 'accent',
    },
    WAITING: {
      icon: ({ size }: { size?: number }) => (
        <span data-testid="icon-waiting" data-size={size}>
          WaitingIcon
        </span>
      ),
      hierarchy: 'secondary',
      color: 'primary',
    },
  },
}));

describe(WorkflowHistoryEventStatusBadge.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders skeleton when isLoading is true', () => {
    setup({ status: 'COMPLETED', isLoading: true });

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('badge')).not.toBeInTheDocument();
  });

  it('renders badge when isLoading is false', () => {
    setup({ status: 'COMPLETED', isLoading: false });

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('renders badge when isLoading is not provided', () => {
    setup({ status: 'COMPLETED' });

    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('renders statusText inside the badge', () => {
    setup({ status: 'COMPLETED', statusText: 'Done' });

    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('renders COMPLETED badge with correct icon, hierarchy, and color', () => {
    setup({ status: 'COMPLETED', statusText: 'Completed' });

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-hierarchy', 'secondary');
    expect(badge).toHaveAttribute('data-color', 'positive');
    expect(screen.getByTestId('icon-completed')).toBeInTheDocument();
  });

  it('renders FAILED badge with correct icon, hierarchy, and color', () => {
    setup({ status: 'FAILED', statusText: 'Failed' });

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-hierarchy', 'primary');
    expect(badge).toHaveAttribute('data-color', 'negative');
    expect(screen.getByTestId('icon-failed')).toBeInTheDocument();
  });

  it('renders CANCELED badge with correct icon, hierarchy, and color', () => {
    setup({ status: 'CANCELED', statusText: 'Canceled' });

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-hierarchy', 'secondary');
    expect(badge).toHaveAttribute('data-color', 'negative');
    expect(screen.getByTestId('icon-canceled')).toBeInTheDocument();
  });

  it('renders ONGOING badge with correct icon, hierarchy, and color', () => {
    setup({ status: 'ONGOING', statusText: 'Ongoing' });

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-hierarchy', 'primary');
    expect(badge).toHaveAttribute('data-color', 'accent');
    expect(screen.getByTestId('icon-ongoing')).toBeInTheDocument();
  });

  it('renders WAITING badge with correct icon, hierarchy, and color', () => {
    setup({ status: 'WAITING', statusText: 'Waiting' });

    const badge = screen.getByTestId('badge');
    expect(badge).toHaveAttribute('data-hierarchy', 'secondary');
    expect(badge).toHaveAttribute('data-color', 'primary');
    expect(screen.getByTestId('icon-waiting')).toBeInTheDocument();
  });
});

function setup(props: Props) {
  return render(<WorkflowHistoryEventStatusBadge {...props} />);
}
