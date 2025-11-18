import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import type {
  HistoryEventsGroups,
  PendingActivityTaskStartEvent,
  PendingDecisionTaskStartEvent,
} from '../workflow-history.types';

export type ProcessEventsParams = {
  pendingStartActivities: PendingActivityTaskStartEvent[];
  pendingStartDecision: PendingDecisionTaskStartEvent | null;
};

/**
 * Processing status for incremental grouping operations.
 */
export type ProcessingStatus = 'idle' | 'processing';

/**
 * State snapshot of the grouping process.
 */
export type GroupingProcessState = {
  /** Current groups accumulated so far */
  groups: HistoryEventsGroups;
  /** Number of events that have been successfully processed since the grouper was created/reset */
  processedEventsCount: number;
  /** Number of events that are still pending (not yet processed) */
  remainingEventsCount: number;
  /** Current processing status */
  status: ProcessingStatus;
};

/**
 * Callback invoked when grouping state changes.
 */
export type GroupingStateChangeCallback = (state: GroupingProcessState) => void;

export type Props = {
  /**
   * Batch size for incremental processing.
   * If specified, events will be processed in batches to allow progress updates.
   * If not specified, all events are processed at once.
   */
  batchSize?: number;
};
