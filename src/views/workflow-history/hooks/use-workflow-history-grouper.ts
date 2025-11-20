import { useCallback, useEffect, useRef } from 'react';

import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import useThrottledState from '@/hooks/use-throttled-state';

import HistoryEventsGrouper from '../helpers/workflow-history-grouper';
import type {
  GroupingProcessState,
  ProcessEventsParams,
} from '../helpers/workflow-history-grouper.types';

/**
 * Hook for grouping workflow history events using the HistoryEventsGrouper.
 */
export default function useWorkflowHistoryGrouper(throttleMs = 2000) {
  // Initialize the grouper once and persist across renders
  const grouperRef = useRef<HistoryEventsGrouper | null>(null);

  if (!grouperRef.current) {
    grouperRef.current = new HistoryEventsGrouper({
      batchSize: 300,
    });
  }

  // Track grouping state - updated internally during processing
  const [groupingState, setGroupingState] =
    useThrottledState<GroupingProcessState>(
      grouperRef.current.getState(),
      throttleMs,
      {
        leading: true,
        trailing: true,
      }
    );

  useEffect(() => {
    if (!grouperRef.current) return;

    const unsubscribe = grouperRef.current.onChange((state) => {
      const setImmediate = state.processedEventsCount < 300;
      setGroupingState(() => state, setImmediate);
    });

    return () => unsubscribe();
  }, [setGroupingState]);

  useEffect(() => {
    return () => {
      grouperRef.current?.destroy();
    };
  }, []);

  // Expose updateEvents method (usually called automatically by effect)
  const updateEvents = useCallback((newEvents: HistoryEvent[]) => {
    if (!grouperRef.current) {
      return;
    }

    grouperRef.current.updateEvents(newEvents);
  }, []);

  // Expose updatePendingEvents method
  const updatePendingEvents = useCallback((params: ProcessEventsParams) => {
    if (!grouperRef.current) {
      return;
    }
    grouperRef.current.updatePendingEvents(params);
  }, []);

  return {
    eventGroups: groupingState?.groups ?? {},
    isProcessing: groupingState?.status === 'processing',
    groupingState,
    updateEvents,
    updatePendingEvents,
  };
}
