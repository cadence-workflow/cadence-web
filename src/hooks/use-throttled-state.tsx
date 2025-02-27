import { useCallback, useState, useRef, useMemo, useEffect } from 'react';

import type { ThrottleSettings } from 'lodash';
import throttle from 'lodash/throttle';

export default function useThrottledState<State>(
  initValue: State,
  throttleMillis = 700,
  throttleOptions: ThrottleSettings = {}
) {
  const { leading, trailing } = throttleOptions;
  const stateRef = useRef(initValue);
  const [, setState] = useState<State>(initValue);

  const throttledSetState = useMemo(
    () => throttle(setState, throttleMillis, { leading, trailing }),
    [setState, throttleMillis, leading, trailing]
  );

  // clear previous throttled events
  useEffect(() => {
    return () => throttledSetState.cancel();
  }, [throttledSetState]);

  const refSetState = useCallback(
    (callback: (arg: State) => State, executeImmediately?: boolean): void => {
      if (typeof callback !== 'function')
        throw new Error(
          'useThrottledState setter function requires function as first argument'
        );
      const newVal = callback(stateRef.current);
      stateRef.current = newVal;
      throttledSetState(newVal);
      if (executeImmediately) {
        throttledSetState.flush();
      }
    },
    [throttledSetState]
  );

  return [stateRef.current, refSetState] as const;
}
