import { useEffect, useState } from 'react';

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
    }, 1000 / 30);

    return () => clearInterval(intervalId);
  }, [isWorkflowRunning]);

  return currentTimeMs;
}
