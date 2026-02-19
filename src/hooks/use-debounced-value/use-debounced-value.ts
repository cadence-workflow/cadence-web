import { useState, useEffect, useMemo } from 'react';

import debounce from 'lodash/debounce';

export default function useDebouncedValue<T>(
  value: T,
  delayMs: number
): {
  debouncedValue: T;
  isDebouncePending: boolean;
} {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const setDebounced = useMemo(
    () => debounce(setDebouncedValue, delayMs),
    [delayMs]
  );

  useEffect(() => {
    setDebounced(value);
    return () => {
      setDebounced.cancel();
    };
  }, [value, setDebounced]);

  const isDebouncePending = value !== debouncedValue;

  return { debouncedValue, isDebouncePending };
}
