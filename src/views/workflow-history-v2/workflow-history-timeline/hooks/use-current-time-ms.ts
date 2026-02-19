import { useEffect, useState } from 'react';

import { TIMELINE_UPDATE_INTERVAL_MS } from '../workflow-history-timeline.constants';

export default function useCurrentTimeMs({
  isWorkflowRunning,
}: {
  isWorkflowRunning: boolean;
}) {
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(Date.now());

  useEffect(() => {
    if (!isWorkflowRunning) return;

    const intervalId = setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, TIMELINE_UPDATE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isWorkflowRunning]);

  return currentTimeMs;
}
