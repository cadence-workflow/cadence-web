import { renderHook, act } from '@/test-utils/rtl';

import useLocalStorageValue from '../use-local-storage-value';

// Mock the logger to avoid console output during tests
jest.mock('@/utils/logger', () => ({
  warn: jest.fn(),
}));

describe(useLocalStorageValue.name, () => {
  const mockKey = 'test-key';
  const mockEncode = jest.fn((value: any) => JSON.stringify(value));
  const mockDecode = jest.fn((value: string) => JSON.parse(value));

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should return null when no value is stored', () => {
    const { result } = renderHook(() =>
      useLocalStorageValue({
        key: mockKey,
        encode: mockEncode,
        decode: mockDecode,
      })
    );

    expect(result.current.getValue()).toBeNull();
  });

  it('should return decoded value when value is stored', () => {
    const testValue = { name: 'test', count: 42 };
    const encodedValue = JSON.stringify(testValue);

    localStorage.setItem(mockKey, encodedValue);

    const { result } = renderHook(() =>
      useLocalStorageValue({
        key: mockKey,
        encode: mockEncode,
        decode: mockDecode,
      })
    );

    const retrievedValue = result.current.getValue();

    expect(mockDecode).toHaveBeenCalledWith(encodedValue);
    expect(retrievedValue).toEqual(testValue);
  });

  it('should return null when decode function throws an error', () => {
    const invalidValue = 'invalid-json';
    const mockDecodeWithError = jest.fn(() => {
      throw new Error('Invalid JSON');
    });

    localStorage.setItem(mockKey, invalidValue);

    const { result } = renderHook(() =>
      useLocalStorageValue({
        key: mockKey,
        encode: mockEncode,
        decode: mockDecodeWithError,
      })
    );

    const retrievedValue = result.current.getValue();

    expect(retrievedValue).toBeNull();
  });

  //   const originalWindow = global.window;
  //   // @ts-expect-error - intentionally setting window to undefined for SSR test
  //   delete global.window;

  //   const { result } = renderHook(() =>
  //     useLocalStorageValue({
  //       key: mockKey,
  //       encode: mockEncode,
  //       decode: mockDecode,
  //     })
  //   );

  //   expect(result.current.getValue()).toBeNull();

  //   // Restore window
  //   global.window = originalWindow;
  // });

  it('should handle encode errors gracefully', () => {
    const mockEncodeWithError = jest.fn(() => {
      throw new Error('Encode error');
    });

    const { result } = renderHook(() =>
      useLocalStorageValue({
        key: mockKey,
        encode: mockEncodeWithError,
        decode: mockDecode,
      })
    );

    const testValue = { name: 'test' };

    act(() => {
      result.current.setValue(testValue);
    });

    expect(mockEncodeWithError).toHaveBeenCalledWith(testValue);
    expect(localStorage.getItem(mockKey)).toBeNull();
  });

  it('should remove value from localStorage', () => {
    // First set a value
    localStorage.setItem(mockKey, 'test-value');

    const { result } = renderHook(() =>
      useLocalStorageValue({
        key: mockKey,
        encode: mockEncode,
        decode: mockDecode,
      })
    );

    act(() => {
      result.current.clearValue();
    });

    expect(localStorage.getItem(mockKey)).toBeNull();
  });
});
