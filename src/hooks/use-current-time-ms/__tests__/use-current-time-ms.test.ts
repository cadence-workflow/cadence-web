import { act, renderHook } from '@/test-utils/rtl';

import useCurrentTimeMs from '../use-current-time-ms';
import { type UseCurrentTimeMsParams } from '../use-current-time-ms.types';

const INTERVAL_MS = 1000;

describe(useCurrentTimeMs.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('advances the returned time on every interval', () => {
    const { result } = setup();

    const initialTimeMs = result.current;

    act(() => {
      jest.advanceTimersByTime(INTERVAL_MS);
    });
    expect(result.current).toBe(initialTimeMs + INTERVAL_MS);

    act(() => {
      jest.advanceTimersByTime(INTERVAL_MS);
    });
    expect(result.current).toBe(initialTimeMs + INTERVAL_MS * 2);
  });

  it('holds the initial time while disabled', () => {
    const { result } = setup({ isEnabled: false });

    const initialTimeMs = result.current;

    act(() => {
      jest.advanceTimersByTime(INTERVAL_MS * 2);
    });

    expect(result.current).toBe(initialTimeMs);
  });

  it('stops advancing once it is disabled, keeping the last time', () => {
    const { result, rerender } = setup();

    const initialTimeMs = result.current;

    act(() => {
      jest.advanceTimersByTime(INTERVAL_MS);
    });
    expect(result.current).toBe(initialTimeMs + INTERVAL_MS);

    rerender({ intervalMs: INTERVAL_MS, isEnabled: false });
    act(() => {
      jest.advanceTimersByTime(INTERVAL_MS);
    });

    expect(result.current).toBe(initialTimeMs + INTERVAL_MS);
  });

  it('reschedules on the new interval when it changes', () => {
    const { result, rerender } = setup();

    const initialTimeMs = result.current;

    rerender({ intervalMs: INTERVAL_MS * 4 });
    act(() => {
      jest.advanceTimersByTime(INTERVAL_MS);
    });
    expect(result.current).toBe(initialTimeMs);

    act(() => {
      jest.advanceTimersByTime(INTERVAL_MS * 3);
    });
    expect(result.current).toBe(initialTimeMs + INTERVAL_MS * 4);
  });
});

function setup(params: Partial<UseCurrentTimeMsParams> = {}) {
  const initialProps = { intervalMs: INTERVAL_MS, ...params };

  return renderHook(
    (props = initialProps) => useCurrentTimeMs(props),
    undefined,
    { initialProps }
  );
}
