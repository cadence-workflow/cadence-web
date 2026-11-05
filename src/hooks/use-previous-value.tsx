import { useRef, useEffect } from 'react';

function usePreviousValue<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePreviousValue;
