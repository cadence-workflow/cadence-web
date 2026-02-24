import React from 'react';

import dayjs from 'dayjs';

import { render, screen, act } from '@/test-utils/rtl';

import formatTimeDiff from '@/utils/datetime/format-time-diff';

import WorkflowSummaryDuration from '../workflow-summary-duration';

jest.mock('@/utils/datetime/format-time-diff', () =>
  jest.fn((startTime, endTime) =>
    String(dayjs(endTime ?? undefined).diff(dayjs(startTime), 'seconds'))
  )
);

const mockStartTime = new Date('2024-01-01T10:00:00Z');
const mockCloseTime = new Date('2024-01-01T10:01:00Z');
const mockNow = new Date('2024-01-01T10:02:00Z').getTime();

describe(WorkflowSummaryDuration.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockNow);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders duration for completed workflow', () => {
    setup({
      formattedFirstEvent: { timestamp: mockStartTime },
      formattedCloseEvent: { timestamp: mockCloseTime },
    });

    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('renders duration for ongoing workflow', () => {
    setup({
      formattedFirstEvent: { timestamp: mockStartTime },
      formattedCloseEvent: null,
    });

    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('renders "-" when first event has no timestamp', () => {
    setup({
      formattedFirstEvent: { timestamp: null },
      formattedCloseEvent: { timestamp: mockCloseTime },
    });

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders "-" when first event is null', () => {
    setup({
      formattedFirstEvent: null,
      formattedCloseEvent: { timestamp: mockCloseTime },
    });

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('updates duration for ongoing workflow every second', () => {
    setup({
      formattedFirstEvent: { timestamp: mockStartTime },
      formattedCloseEvent: null,
    });

    expect(screen.getByText('120')).toBeInTheDocument();

    (formatTimeDiff as jest.Mock).mockClear();
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

    expect(formatTimeDiff).toHaveBeenCalledTimes(2);
  });

  it('does not set up interval for completed workflow', () => {
    setup({
      formattedFirstEvent: { timestamp: mockStartTime },
      formattedCloseEvent: { timestamp: mockCloseTime },
    });

    (formatTimeDiff as jest.Mock).mockClear();
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(formatTimeDiff).not.toHaveBeenCalled();
  });

  it('cleans up interval when component unmounts', () => {
    const { unmount } = setup({
      formattedFirstEvent: { timestamp: mockStartTime },
      formattedCloseEvent: null,
    });

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});

function setup({
  formattedFirstEvent = { timestamp: mockStartTime },
  formattedCloseEvent = { timestamp: mockCloseTime },
}: {
  formattedFirstEvent?: { timestamp: Date | null } | null;
  formattedCloseEvent?: { timestamp: Date | null } | null;
} = {}) {
  return render(
    <WorkflowSummaryDuration
      formattedFirstEvent={formattedFirstEvent as any}
      formattedCloseEvent={formattedCloseEvent as any}
    />
  );
}
