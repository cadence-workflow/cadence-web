import { useEffect, useState } from 'react';

export default function useCurrentTimeMs({
  isWorkflowRunning,
}: {
  isWorkflowRunning: boolean;
}) {
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(Date.now());

  useEffect(() => {
    if (!isWorkflowRunning) return;

    let frameId: number;

    const tick = () => {
      setCurrentTimeMs(Date.now());
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isWorkflowRunning]);

  return currentTimeMs;
}
