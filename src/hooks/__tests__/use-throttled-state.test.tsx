import { renderHook, act, waitFor } from '@testing-library/react';
import throttle from 'lodash/throttle';

import useThrottledState from '../use-throttled-state';

jest.mock('lodash/throttle', () => {
  const original = jest.requireActual('lodash/throttle');
  return jest.fn(original);
});
const mockedThrottle = throttle as jest.Mock;

const defaultThrottleSettings = { leading: false, trailing: true };

describe('useThrottledState', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedThrottle.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with the given value', () => {
    const { result } = renderHook(() => useThrottledState(0));
    expect(result.current[0]).toBe(0);
  });

  it('should pass the correct settings to throttle', () => {
    renderHook(() => useThrottledState(0, 1, defaultThrottleSettings));
    expect(mockedThrottle).toHaveBeenCalledWith(
      expect.any(Function),
      1,
      defaultThrottleSettings
    );
  });

  it('should immediately update if executeImmediately is true', () => {
    const { result } = renderHook(() =>
      useThrottledState(0, 10000, defaultThrottleSettings)
    );
    const setState = result.current[1];

    act(() => {
      setState((prev) => prev + 1, true);
    });

    expect(result.current[0]).toBe(1);
  });

  it('should return the latest value if rerendered externaly', async () => {
    const { result, rerender } = renderHook(() =>
      useThrottledState(0, 10000, defaultThrottleSettings)
    );
    const setState = result.current[1];

    act(() => {
      setState((prev) => prev + 1);
      setState((prev) => prev + 1);
      setState((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(0);
    rerender();
    expect(result.current[0]).toBe(3);
  });

  it('should throttle updating state', async () => {
    const { result } = renderHook(() =>
      useThrottledState(0, 10000, defaultThrottleSettings)
    );
    const setState = result.current[1];

    act(() => {
      setState((prev) => prev + 1);
      setState((prev) => prev + 1);
      setState((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(0);
    jest.advanceTimersByTime(10000);
    await waitFor(() => expect(result.current[0]).toBe(3));
  });
});
