import { act, renderHook } from '@/test-utils/rtl';

import useCurrentTimeMs from '../use-current-time-ms';

describe(useCurrentTimeMs.name, () => {
  let rafCallbacks: Array<FrameRequestCallback>;
  let rafIdCounter: number;

  beforeEach(() => {
    jest.useFakeTimers();
    rafCallbacks = [];
    rafIdCounter = 0;

    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback) => {
        rafCallbacks.push(callback);
        return ++rafIdCounter;
      });

    jest
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation((_id: number) => {
        // Clear callbacks (simplified - in real impl would track by id)
        rafCallbacks = [];
      });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should return initial time when workflow is not running', () => {
    const mockNow = 1705312800000;
    jest.setSystemTime(mockNow);

    const { result } = setup({ isWorkflowRunning: false });

    expect(result.current).toBe(mockNow);
  });

  it('should not start animation frame when workflow is not running', () => {
    const mockNow = 1705312800000;
    jest.setSystemTime(mockNow);

    setup({ isWorkflowRunning: false });

    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('should start animation frame when workflow is running', () => {
    const mockNow = 1705312800000;
    jest.setSystemTime(mockNow);

    setup({ isWorkflowRunning: true });

    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should update time on animation frame when workflow is running', () => {
    const mockNow = 1705312800000;
    jest.setSystemTime(mockNow);

    const { result } = setup({ isWorkflowRunning: true });

    expect(result.current).toBe(mockNow);

    // Move system time forward
    const newTime = mockNow + 16;
    jest.setSystemTime(newTime);

    // Trigger animation frame callback
    act(() => {
      const callback = rafCallbacks.shift();
      if (callback) callback(0);
    });

    expect(result.current).toBe(newTime);
  });

  it('should stop updating when workflow stops running', () => {
    const mockNow = 1705312800000;
    jest.setSystemTime(mockNow);

    const { result, rerender } = setup({ isWorkflowRunning: true });

    // Advance time while running
    const timeWhileRunning = mockNow + 100;
    jest.setSystemTime(timeWhileRunning);
    act(() => {
      const callback = rafCallbacks.shift();
      if (callback) callback(0);
    });

    expect(result.current).toBe(timeWhileRunning);

    // Stop the workflow
    rerender({ isWorkflowRunning: false });

    // cancelAnimationFrame should have been called
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
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
