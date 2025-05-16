import React from 'react';

import { render, screen, act } from '@/test-utils/rtl';

import { WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

import WorkflowHistoryEventsDurationBadge from '../workflow-history-events-duration-badge';
import type { Props } from '../workflow-history-events-duration-badge.types';

jest.mock('@/utils/data-formatters/format-duration', () =>
  jest.fn(({ seconds }) => `${seconds} seconds`)
);

const mockStartTime = new Date('2024-01-01T10:00:00Z');
const mockCloseTime = new Date('2024-01-01T10:01:00Z');
const mockNow = new Date('2024-01-01T10:00:00Z');

describe('WorkflowHistoryEventsDurationBadge', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders duration badge for completed event', () => {
    setup({
      closeTime: mockCloseTime,
    });

    expect(screen.getByText('Duration: 60 seconds')).toBeInTheDocument();
  });

  it('renders duration badge for ongoing event', () => {
    setup({
      closeTime: null,
    });

    expect(screen.getByText('Duration: 0 seconds')).toBeInTheDocument();
  });

  it('does not render badge for single event', () => {
    setup({
      eventsCount: 1,
      hasMissingEvents: false,
    });

    expect(screen.queryByText(/Duration:/)).not.toBeInTheDocument();
  });

  it('renders badge for single event with missing events', () => {
    setup({
      eventsCount: 1,
      hasMissingEvents: true,
    });

    expect(screen.getByText('Duration: 0 seconds')).toBeInTheDocument();
  });

  it('does not render badge when workflow is archived without close time', () => {
    setup({
      closeTime: null,
      workflowIsArchived: true,
    });

    expect(screen.queryByText(/Duration:/)).not.toBeInTheDocument();
  });

  it('does not render badge when workflow has close status without close time', () => {
    setup({
      workflowCloseStatus:
        WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED,
    });

    expect(screen.queryByText(/Duration:/)).not.toBeInTheDocument();
  });

  it('updates duration for ongoing event every second', () => {
    setup({
      closeTime: null,
    });

    expect(screen.getByText('Duration: 0 seconds')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
      jest.setSystemTime(new Date(mockNow.getTime() + 1000));
    });
    expect(screen.getByText('Duration: 1 seconds')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
      jest.setSystemTime(new Date(mockNow.getTime() + 2000));
    });
    expect(screen.getByText('Duration: 2 seconds')).toBeInTheDocument();
  });

  it('cleans up interval when component unmounts', () => {
    const { unmount } = setup();

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('uses workflow close time when close time is not provided', () => {
    setup({
      closeTime: null,
      workflowCloseTime: mockCloseTime,
    });

    expect(screen.getByText('Duration: 60 seconds')).toBeInTheDocument();
  });
});

function setup({
  startTime = mockStartTime,
  closeTime,
  eventsCount = 2,
  hasMissingEvents = false,
  workflowIsArchived = false,
  workflowCloseStatus = WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID,
  workflowCloseTime = null,
}: Partial<Props> = {}) {
  return render(
    <WorkflowHistoryEventsDurationBadge
      startTime={startTime}
      closeTime={closeTime}
      eventsCount={eventsCount}
      hasMissingEvents={hasMissingEvents}
      workflowIsArchived={workflowIsArchived}
      workflowCloseStatus={workflowCloseStatus}
      workflowCloseTime={workflowCloseTime}
    />
  );
}
