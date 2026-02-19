import { act, renderHook } from '@/test-utils/rtl';

import useCurrentTimeMs from '../use-current-time-ms';

jest.mock('../../workflow-history-timeline.constants', () => ({
  ...jest.requireActual('../../workflow-history-timeline.constants'),
  TIMELINE_UPDATE_INTERVAL_MS: 1000,
}));

describe(useCurrentTimeMs.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial time when workflow is not running', () => {
    const { result } = setup({ isWorkflowRunning: false });

    const initialTime = result.current;

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Time should not update since no interval is running
    expect(result.current).toBe(initialTime);
  });

  it('should update time on interval when workflow is running', () => {
    const { result } = setup({ isWorkflowRunning: true });

    const initialTime = result.current;

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(initialTime + 1000);
  });

  it('should update time multiple times when workflow is running', () => {
    const { result } = setup({ isWorkflowRunning: true });

    const initialTime = result.current;

    // First interval tick
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(initialTime + 1000);

    // Second interval tick
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(initialTime + 2000);
  });

  it('should stop updating when workflow stops running', () => {
    const { result, rerender } = setup({ isWorkflowRunning: true });

    const initialTime = result.current;

    // Advance time while running
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(initialTime + 1000);

    // Stop the workflow
    rerender({ isWorkflowRunning: false });

    // Advance time further - should not update
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(initialTime + 1000);
  });
});

function setup({ isWorkflowRunning }: { isWorkflowRunning: boolean }) {
  return renderHook(
    (props = { isWorkflowRunning }) =>
      useCurrentTimeMs({ isWorkflowRunning: props.isWorkflowRunning }),
    undefined,
    { initialProps: { isWorkflowRunning } }
  );
}
