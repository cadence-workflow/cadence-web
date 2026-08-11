import { useCallback, useEffect, useRef } from 'react';

import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import useThrottledState from '@/hooks/use-throttled-state';

import HistoryEventsGrouper from '../helpers/workflow-history-grouper';
import type {
  GroupingProcessState,
  ProcessEventsParams,
} from '../helpers/workflow-history-grouper.types';

import { BATCH_SIZE } from './use-workflow-history-grouper.constants';

/**
 * Hook for grouping workflow history events using the HistoryEventsGrouper.
 */
export default function useWorkflowHistoryGrouper(throttleMs = 2000) {
  const grouperRef = useRef<HistoryEventsGrouper | null>(null);

  if (!grouperRef.current) {
    grouperRef.current = new HistoryEventsGrouper({
      batchSize: BATCH_SIZE,
    });
  }

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
      const setImmediate = state.processedEventsCount < BATCH_SIZE;
      setGroupingState(() => state, setImmediate);
    });

    return () => unsubscribe();
  }, [setGroupingState]);

  useEffect(() => {
    return () => {
      grouperRef.current?.destroy();
    };
  }, []);

  const updateEvents = useCallback((newEvents: HistoryEvent[]) => {
    if (!grouperRef.current) {
      return;
    }

    grouperRef.current.updateEvents(newEvents);
  }, []);

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
