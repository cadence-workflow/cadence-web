'use client';
import { useEffect, useRef, useState } from 'react';

import { CHART_GLYPH_ENTER_ANIMATION_MS } from './schedule-details-runs-chart.constants';

const NO_NEW_TIMES_MS: ReadonlySet<number> = new Set();

/**
 * Times in one series that appeared after the chart's first loaded snapshot,
 * so only the glyphs a viewer saw arrive animate in. Older times fetched by
 * paging back are excluded by accepting a time only when it is newer than
 * everything seen so far, which is why each series needs its own call: runs
 * and skips sit behind the next run, so one shared baseline would swallow
 * them. Times are dropped again once the animation has played, so a glyph
 * that panning unmounts and remounts does not replay it.
 */
export default function useNewChartTimesMs({
  timesMs,
  isEnabled,
}: {
  timesMs: number[];
  isEnabled: boolean;
}): ReadonlySet<number> {
  const [newTimesMs, setNewTimesMs] =
    useState<ReadonlySet<number>>(NO_NEW_TIMES_MS);
  const latestSeenMsRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const previousLatestSeenMs = latestSeenMsRef.current;

    latestSeenMsRef.current = timesMs.reduce(
      (latestMs, timeMs) => Math.max(latestMs, timeMs),
      previousLatestSeenMs ?? -Infinity
    );

    if (previousLatestSeenMs == null) {
      return;
    }

    const addedTimesMs = timesMs.filter(
      (timeMs) => timeMs > previousLatestSeenMs
    );

    if (addedTimesMs.length > 0) {
      setNewTimesMs(new Set(addedTimesMs));
    }
  }, [isEnabled, timesMs]);

  useEffect(() => {
    if (newTimesMs.size === 0) {
      return;
    }

    const timeoutId = setTimeout(
      () => setNewTimesMs(NO_NEW_TIMES_MS),
      CHART_GLYPH_ENTER_ANIMATION_MS
    );

    return () => clearTimeout(timeoutId);
  }, [newTimesMs]);

  return newTimesMs;
}
