import { useEffect, useState } from 'react';

import { type UseCurrentTimeMsParams } from './use-current-time-ms.types';

export default function useCurrentTimeMs({
  intervalMs,
  isEnabled = true,
}: UseCurrentTimeMsParams): number {
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(Date.now());

  useEffect(() => {
    if (!isEnabled) return;

    const intervalId = setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [intervalMs, isEnabled]);

  return currentTimeMs;
}
