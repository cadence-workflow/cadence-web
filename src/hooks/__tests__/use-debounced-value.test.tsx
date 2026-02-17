import { renderHook, act } from '@testing-library/react';

import useDebouncedValue from '../use-debounced-value/use-debounced-value';

const DEBOUNCE_MS = 300;

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with the given value', () => {
    const { result } = renderHook(() =>
      useDebouncedValue('initial', DEBOUNCE_MS)
    );

    expect(result.current.debouncedValue).toBe('initial');
    expect(result.current.isDebouncePending).toBe(false);
  });

  it('should not update debouncedValue before delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DEBOUNCE_MS),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    expect(result.current.debouncedValue).toBe('initial');
    expect(result.current.isDebouncePending).toBe(true);
  });

  it('should update debouncedValue after delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DEBOUNCE_MS),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_MS + 10);
    });

    expect(result.current.debouncedValue).toBe('updated');
    expect(result.current.isDebouncePending).toBe(false);
  });

  it('should only use the latest value when multiple updates happen within delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DEBOUNCE_MS),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    rerender({ value: 'c' });
    rerender({ value: 'd' });

    expect(result.current.debouncedValue).toBe('a');
    expect(result.current.isDebouncePending).toBe(true);

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_MS + 10);
    });

    expect(result.current.debouncedValue).toBe('d');
    expect(result.current.isDebouncePending).toBe(false);
  });

  it('should cancel pending debounce on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebouncedValue(value, DEBOUNCE_MS),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    unmount();

    // Should not throw after unmount
    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_MS + 10);
    });
  });

  it('should report isDebouncePending as false when value reverts to debouncedValue', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, DEBOUNCE_MS),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    expect(result.current.isDebouncePending).toBe(true);

    // Revert back to original value before debounce fires
    rerender({ value: 'initial' });
    expect(result.current.isDebouncePending).toBe(false);
  });
});
