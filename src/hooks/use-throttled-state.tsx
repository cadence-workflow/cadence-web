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

  const throttledRerender = useMemo(
    () => throttle(setState, throttleMillis, { leading, trailing }),
    [setState, throttleMillis, leading, trailing]
  );

  // clear previous throttled events
  useEffect(() => {
    return () => throttledRerender.cancel();
  }, [throttledRerender]);

  const refSetState = useCallback(
    (callback: (arg: State) => State, executeImmediately?: boolean): void => {
      const newVal = callback(stateRef.current);
      stateRef.current = newVal;
      throttledRerender(newVal);
      if (executeImmediately) {
        throttledRerender.flush();
      }
    },
    [throttledRerender]
  );

  return [stateRef.current, refSetState] as const;
}
