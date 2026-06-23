import { useEffect, useState } from 'react';

import { CURRENT_TIME_UPDATE_INTERVAL_MS } from '../schedule-detail-metrics-chart.constants';

export default function useCurrentTimeMs() {
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, CURRENT_TIME_UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  return currentTimeMs;
}
