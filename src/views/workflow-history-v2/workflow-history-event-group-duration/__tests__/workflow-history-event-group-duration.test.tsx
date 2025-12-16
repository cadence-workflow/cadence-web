import React from 'react';

import dayjs from 'dayjs';

import { render, screen, act } from '@/test-utils/rtl';

import { WorkflowExecutionCloseStatus } from '@/__generated__/proto-ts/uber/cadence/api/v1/WorkflowExecutionCloseStatus';

import getFormattedEventsDuration from '../helpers/get-formatted-events-duration';
import WorkflowHistoryEventGroupDuration from '../workflow-history-event-group-duration';
import type { Props } from '../workflow-history-event-group-duration.types';

jest.mock('../helpers/get-formatted-events-duration', () =>
  jest.fn((startTime, endTime) =>
    String(dayjs(endTime ?? undefined).diff(dayjs(startTime), 'seconds'))
  )
);

jest.mock(
  '@/views/workflow-history/workflow-history-remaining-duration-badge/workflow-history-remaining-duration-badge',
  () => {
    return function MockWorkflowHistoryRemainingDurationBadge({
      prefix,
      expectedEndTime,
    }: {
      prefix: string;
      expectedEndTime: number;
    }) {
      return (
        <div data-testid="end-time-badge">{`${prefix} ${expectedEndTime}`}</div>
      );
    };
  }
);

const mockStartTime = new Date('2024-01-01T10:00:00Z').getTime();
const mockCloseTime = new Date('2024-01-01T10:01:00Z').getTime();
const mockNow = new Date('2024-01-01T10:02:00Z').getTime();

describe('WorkflowHistoryEventGroupDuration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders duration for completed event', () => {
    setup({
      closeTime: mockCloseTime,
    });

    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('renders duration for ongoing event', () => {
    setup({
      closeTime: null,
    });
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('does not render duration for single event', () => {
    setup({
      eventsCount: 1,
      hasMissingEvents: false,
    });

    expect(screen.queryByText('60')).not.toBeInTheDocument();
  });

  it('renders duration for single event with missing events', () => {
    setup({
      eventsCount: 1,
      hasMissingEvents: true,
    });

    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('does not render duration when loading more events', () => {
    setup({
      loadingMoreEvents: true,
    });

    expect(screen.queryByText('60')).not.toBeInTheDocument();
  });

  it('does not render duration when workflow is archived without close time', () => {
    setup({
      closeTime: null,
      workflowIsArchived: true,
    });

    expect(screen.queryByText('120')).not.toBeInTheDocument();
  });

  it('does not render duration when workflow has close status without close time', () => {
    setup({
      workflowCloseStatus:
        WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED,
    });

    expect(screen.queryByText('60')).not.toBeInTheDocument();
  });

  it('updates duration for ongoing event every second', () => {
    setup({
      closeTime: null,
    });
    expect(screen.getByText('120')).toBeInTheDocument();

    (getFormattedEventsDuration as jest.Mock).mockClear();
    act(() => {
      jest.advanceTimersByTime(1000);
      jest.setSystemTime(new Date(mockNow + 1000));
    });
    expect(screen.getByText('121')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1000);
      jest.setSystemTime(new Date(mockNow + 2000));
    });
    expect(screen.getByText('122')).toBeInTheDocument();

    expect(getFormattedEventsDuration).toHaveBeenCalledTimes(2);
  });

  it('uses workflow close time when close time is not provided', () => {
    setup({
      closeTime: null,
      workflowCloseTime: mockCloseTime,
    });

    expect(getFormattedEventsDuration).toHaveBeenCalledWith(
      mockStartTime,
      mockCloseTime,
      expect.any(Boolean)
    );
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('renders end time badge when expectedEndTimeInfo is provided', () => {
    const expectedEndTime = new Date('2024-01-01T10:05:00Z').getTime();
    setup({
      expectedEndTimeInfo: {
        timeMs: expectedEndTime,
        prefix: 'Fires in',
      },
    });

    expect(screen.getByTestId('end-time-badge')).toBeInTheDocument();
    expect(screen.getByText(`Fires in ${expectedEndTime}`)).toBeInTheDocument();
  });

  it('cleans up interval when component unmounts', () => {
    const { unmount } = setup();

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});

function setup({
  startTime = mockStartTime,
  closeTime,
  eventsCount = 2,
  hasMissingEvents = false,
  loadingMoreEvents = false,
  workflowIsArchived = false,
  workflowCloseStatus = WorkflowExecutionCloseStatus.WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID,
  workflowCloseTime = null,
  expectedEndTimeInfo,
}: Partial<Props> = {}) {
  return render(
    <WorkflowHistoryEventGroupDuration
      startTime={startTime}
      closeTime={closeTime}
      eventsCount={eventsCount}
      hasMissingEvents={hasMissingEvents}
      loadingMoreEvents={loadingMoreEvents}
      workflowIsArchived={workflowIsArchived}
      workflowCloseStatus={workflowCloseStatus}
      workflowCloseTime={workflowCloseTime}
      expectedEndTimeInfo={expectedEndTimeInfo}
    />
  );
}
