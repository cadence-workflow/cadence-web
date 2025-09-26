import React from 'react';

import { render, screen, act } from '@/test-utils/rtl';

import { WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

import getFormattedRemainingDuration from '../helpers/get-formatted-remaining-duration';
import WorkflowHistoryRemainingDurationBadge from '../workflow-history-remaining-duration-badge';
import type { Props } from '../workflow-history-remaining-duration-badge.types';

jest.mock('../helpers/get-formatted-remaining-duration');

const mockStartTime = new Date('2024-01-01T10:00:00Z');
const mockNow = new Date('2024-01-01T10:02:00Z');

const mockGetFormattedRemainingDuration =
  getFormattedRemainingDuration as jest.MockedFunction<
    typeof getFormattedRemainingDuration
  >;

describe('WorkflowHistoryRemainingDurationBadge', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
    mockGetFormattedRemainingDuration.mockReturnValue('5m 30s');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders remaining duration badge when duration is available', () => {
    setup();

    expect(screen.getByText('Remaining: 5m 30s')).toBeInTheDocument();
  });

  it('does not render badge when loading more events', () => {
    setup({
      loadingMoreEvents: true,
    });

    expect(screen.queryByText(/Remaining:/)).not.toBeInTheDocument();
  });

  it('does not render badge when workflow is archived', () => {
    setup({
      workflowIsArchived: true,
    });

    expect(screen.queryByText(/Remaining:/)).not.toBeInTheDocument();
  });

  it('does not render badge when workflow has close status', () => {
    const closeStatuses = [
      WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED,
      WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED,
      WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED,
      WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_TERMINATED,
      WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_CONTINUED_AS_NEW,
      WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT,
    ];

    closeStatuses.forEach((status) => {
      const { unmount } = setup({
        workflowCloseStatus: status,
      });

      expect(screen.queryByText(/Remaining:/)).not.toBeInTheDocument();
      unmount();
    });
  });

  it('does not render badge when helper returns null', () => {
    mockGetFormattedRemainingDuration.mockReturnValue(null);

    setup();

    expect(screen.queryByText(/Remaining:/)).not.toBeInTheDocument();
  });

  it('updates remaining duration every second', () => {
    setup();

    expect(screen.getByText('Remaining: 5m 30s')).toBeInTheDocument();

    // Mock different return values for subsequent calls
    mockGetFormattedRemainingDuration.mockReturnValueOnce('5m 29s');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Remaining: 5m 29s')).toBeInTheDocument();

    mockGetFormattedRemainingDuration.mockReturnValueOnce('5m 28s');

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Remaining: 5m 28s')).toBeInTheDocument();

    // Verify the helper was called the expected number of times
    // Initial call + 2 interval updates = 3 calls
    expect(mockGetFormattedRemainingDuration).toHaveBeenCalledTimes(3);
  });

  it('hides badge when duration becomes null during countdown', () => {
    setup();

    expect(screen.getByText('Remaining: 5m 30s')).toBeInTheDocument();

    // Mock helper to return null (indicating overrun)
    mockGetFormattedRemainingDuration.mockReturnValue(null);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.queryByText(/Remaining:/)).not.toBeInTheDocument();
  });

  it('cleans up interval when component unmounts', () => {
    const { unmount } = setup();

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('does not set up interval when shouldHide is true', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    setup({
      workflowIsArchived: true,
    });

    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it('clears existing interval when shouldHide becomes true', () => {
    const { rerender } = setup();

    expect(screen.getByText('Remaining: 5m 30s')).toBeInTheDocument();

    rerender(
      <WorkflowHistoryRemainingDurationBadge
        startTime={mockStartTime}
        expectedEndTime={new Date('2024-01-01T10:07:00Z').getTime()}
        prefix="Remaining:"
        workflowIsArchived={false}
        workflowCloseStatus={
          WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID
        }
        loadingMoreEvents={true}
      />
    );

    expect(screen.queryByText(/Remaining:/)).not.toBeInTheDocument();
  });
});

function setup({
  startTime = mockStartTime,
  expectedEndTime = new Date('2024-01-01T10:07:00Z').getTime(), // 5 minutes from mockNow
  prefix = 'Remaining:',
  workflowIsArchived = false,
  workflowCloseStatus = WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID,
  loadingMoreEvents = false,
}: Partial<Props> = {}) {
  return render(
    <WorkflowHistoryRemainingDurationBadge
      startTime={startTime}
      expectedEndTime={expectedEndTime}
      prefix={prefix}
      workflowIsArchived={workflowIsArchived}
      workflowCloseStatus={workflowCloseStatus}
      loadingMoreEvents={loadingMoreEvents}
    />
  );
}
