import { useCallback } from 'react';

import logger from '@/utils/logger';

/**
 * Provides methods to get, set, and clear a value in localStorage using a specified key,
 * with custom encode and decode functions for serialization and deserialization.
 *
 * @param key - The localStorage key to use.
 * @param encode - Function to serialize the value before storing.
 * @param decode - Function to deserialize the value when retrieving.
 * @returns An object with getValue, setValue, and clearValue methods.
 */
export default function useLocalStorageValue<T>({
  key,
  encode,
  decode,
}: {
  key: string;
  encode: (val: T) => string;
  decode: (val: string) => T;
}): {
  getValue: () => T | null;
  setValue: (value: T) => void;
  clearValue: () => void;
} {
  const getValue = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;

    try {
      return decode(storedValue);
    } catch (error) {
      logger.warn(
        { key, error, storedValue },
        'Failed to decode value stored in local storage'
      );
      return null;
    }
  }, [key, decode]);

  const setValue = useCallback(
    (value: T) => {
      if (typeof window === 'undefined') return () => {};

      try {
        const valueToStore = encode(value);
        localStorage.setItem(key, valueToStore);
      } catch (error) {
        logger.warn(
          { key, error, value },
          'Failed to save value to local storage'
        );
      }
    },
    [key, encode]
  );

  const clearValue = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return {
    getValue,
    setValue,
    clearValue,
  };
}
