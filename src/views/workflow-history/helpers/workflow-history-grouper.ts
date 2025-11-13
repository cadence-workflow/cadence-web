import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import logger from '@/utils/logger';

import type {
  ExtendedActivityHistoryEvent,
  ExtendedDecisionHistoryEvent,
  HistoryEventsGroup,
  HistoryEventsGroups,
  PendingActivityTaskStartEvent,
  PendingDecisionTaskStartEvent,
} from '../workflow-history.types';

import isChildWorkflowExecutionEvent from './check-history-event-group/is-child-workflow-execution-event';
import isExtendedActivityEvent from './check-history-event-group/is-extended-activity-event';
import isExtendedDecisionEvent from './check-history-event-group/is-extended-decision-event';
import isRequestCancelExternalWorkflowExecutionEvent from './check-history-event-group/is-request-cancel-external-workflow-execution-event';
import isSignalExternalWorkflowExecutionEvent from './check-history-event-group/is-signal-external-workflow-execution-event';
import isSingleEvent from './check-history-event-group/is-single-event';
import isTimerEvent from './check-history-event-group/is-timer-event';
import getHistoryEventGroupId from './get-history-event-group-id';
import getActivityGroupFromEvents from './get-history-group-from-events/get-activity-group-from-events';
import getChildWorkflowExecutionGroupFromEvents from './get-history-group-from-events/get-child-workflow-execution-group-from-events';
import getDecisionGroupFromEvents from './get-history-group-from-events/get-decision-group-from-events';
import getRequestCancelExternalWorkflowExecutionGroupFromEvents from './get-history-group-from-events/get-request-cancel-external-workflow-execution-group-from-events';
import getSignalExternalWorkflowExecutionGroupFromEvents from './get-history-group-from-events/get-signal-external-workflow-execution-group-from-events';
import getSingleEventGroupFromEvents from './get-history-group-from-events/get-single-event-group-from-events';
import getTimerGroupFromEvents from './get-history-group-from-events/get-timer-group-from-events';
import placeEventInGroupEvents from './place-event-in-group-events';
import {
  type GroupingProcessState,
  type ProcessEventsParams,
  type Props,
} from './workflow-history-grouper.types';

/**
 * Stateful history events grouper that processes events incrementally.
 *
 * This class maintains the state of processed events and groups, allowing
 * efficient incremental updates as new events arrive. It tracks pending
 * activities and decisions, automatically adding new ones and removing
 * stale ones from groups.
 */
export default class WorkflowHistoryGrouper {
  private allEvents: HistoryEvent[] = [];
  private lastProcessedEventIndex: number = -1;
  private groups: HistoryEventsGroups = {};
  private currentPendingActivities: PendingActivityTaskStartEvent[] = [];
  private currentPendingDecision: PendingDecisionTaskStartEvent | null = null;
  private subscribers: Set<(state: GroupingProcessState) => void> = new Set();
  private batchSize?: number;
  private isProcessing: boolean = false;

  // Buffer for pending events that arrived before their group exists
  private bufferedPendingActivities: PendingActivityTaskStartEvent[] = [];
  private bufferedPendingDecision: PendingDecisionTaskStartEvent | null = null;

  constructor({ batchSize }: Props = {}) {
    this.batchSize = batchSize;
  }

  /**
   * Subscribe to state changes.
   * Returns an unsubscribe function.
   */
  public onChange(callback: (state: GroupingProcessState) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Updates the events list and automatically starts processing.
   * The processor will continue batch by batch until all events are processed.
   * If already processing, the new events will be queued and processed after current batch completes.
   * Listen to onChange for progress updates.
   *
   */
  public updateEvents(events: HistoryEvent[]): void {
    // Update allEvents with the latest complete list
    this.allEvents = events;

    // If already processing, the loop will automatically pick up the new events
    // No need to do anything - the pointer-based approach handles this
    if (this.isProcessing) {
      return;
    }

    this.startProcessing();
  }

  /**
   * Updates pending events (activities and decisions).
   * This should be called separately from updateEvents.
   */
  public updatePendingEvents(params: ProcessEventsParams) {
    // Update pending events (add new ones, remove stale ones)

    const currentPendingActivities = this.currentPendingActivities;
    const currentPendingDecision = this.currentPendingDecision;

    this.currentPendingActivities = params.pendingStartActivities;
    this.currentPendingDecision = params.pendingStartDecision;

    this.bufferedPendingActivities = [];
    this.bufferedPendingDecision = null;

    this.processPendingEvents(
      currentPendingActivities,
      params.pendingStartActivities,
      currentPendingDecision,
      params.pendingStartDecision
    );
  }

  /**
   * Resets the grouper state, clearing all processed events and groups.
   * Useful for reprocessing events from scratch.
   */
  public reset(): void {
    this.allEvents = [];
    this.lastProcessedEventIndex = -1;
    this.groups = {};
    this.currentPendingActivities = [];
    this.currentPendingDecision = null;
    this.bufferedPendingActivities = [];
    this.bufferedPendingDecision = null;
    this.isProcessing = false;
  }

  /**
   * Destroys the grouper, cleaning up all resources.
   * Clears all subscribers and resets internal state.
   * Call this when the grouper is no longer needed.
   */
  public destroy(): void {
    this.subscribers.clear();
    this.reset();
  }

  /**
   * Gets the index of the last processed event.
   */
  public getLastProcessedEventIndex(): number {
    return this.lastProcessedEventIndex;
  }

  /**
   * Gets the current state of the grouper.
   * Returns current groups, processing status, and event counts.
   */
  public getState(): GroupingProcessState {
    return {
      groups: { ...this.groups },
      processedEventsCount: this.lastProcessedEventIndex + 1,
      remainingEventsCount:
        this.allEvents.length - this.lastProcessedEventIndex - 1,
      status: this.isProcessing ? 'processing' : 'idle',
    };
  }

  // ============================================================================
  // Private Implementation
  // ============================================================================

  /**
   * Starts the processing cycle.
   * Schedules the first batch - all batches go through the scheduler.
   */
  private startProcessing(): void {
    // Check if there are events to process
    if (
      this.isProcessing ||
      this.lastProcessedEventIndex >= this.allEvents.length - 1
    ) {
      return;
    }

    this.isProcessing = true;

    // Schedule the first batch (and all subsequent batches will be scheduled too)
    this.scheduleNextBatch();
  }

  /**
   * Schedules the next batch using the best available API.
   * Uses Scheduler API if available, otherwise falls back to setTimeout.
   */
  private scheduleNextBatch() {
    // If first batch, process immediately; this helps avoid UI delays
    if (this.lastProcessedEventIndex === -1) {
      this.processBatch();
    } else if (
      typeof window !== 'undefined' &&
      'scheduler' in window &&
      'postTask' in (window.scheduler as any)
    ) {
      // Use Scheduler API with background priority if available
      (window.scheduler as any)
        .postTask(() => this.processBatch(), { priority: 'background' })
        .catch(() => {
          // Fallback to setTimeout if postTask fails
          // setTimeout adds the processBatch to Macro Task Queue (lowest priority queue) to allow current microtasks (UI updates) to complete first
          setTimeout(() => this.processBatch(), 0);
        });
    } else {
      // Fallback to setTimeout
      setTimeout(() => this.processBatch(), 0);
    }
  }

  /**
   * Processes a single batch of events (or all remaining events if no batchSize).
   * This method handles the core grouping logic and schedules itself for the next batch.
   */
  private processBatch(): void {
    // Check if there are events to process
    if (this.lastProcessedEventIndex >= this.allEvents.length - 1) {
      this.isProcessing = false;
      return;
    }

    // Calculate batch boundaries
    const batchStart = this.lastProcessedEventIndex + 1;
    const batchEnd =
      this.batchSize !== undefined && this.batchSize > 0
        ? Math.min(batchStart + this.batchSize, this.allEvents.length)
        : this.allEvents.length;

    // Process this batch synchronously using indices (avoids array slicing)
    this.groups = this.groupEvents(batchStart, batchEnd, this.groups);

    // After processing new events, try to apply any buffered pending events
    // whose groups may now exist
    this.applyBufferedPendingEvents();

    // Move pointer forward
    this.lastProcessedEventIndex = batchEnd - 1;

    // Check if there are more events to process
    const hasMoreEvents =
      this.lastProcessedEventIndex < this.allEvents.length - 1;

    // Update processing state before reporting to subscribers
    if (!hasMoreEvents) {
      this.isProcessing = false;
    }

    // Report progress to all subscribers
    const state = this.getState();
    this.subscribers.forEach((callback) => callback(state));

    // Schedule next batch if needed
    if (hasMoreEvents) {
      this.scheduleNextBatch();
    }
  }

  /**
   * Groups a batch of new events and updates existing groups.
   * Synchronous implementation that processes events immediately.
   */
  private groupEvents(
    startIndex: number,
    endIndex: number,
    existingGroups: HistoryEventsGroups
  ): HistoryEventsGroups {
    const groups = { ...existingGroups };

    // Process new history events using indices (avoids array slicing)
    for (let i = startIndex; i < endIndex; i++) {
      const event = this.allEvents[i];
      const groupId = getHistoryEventGroupId(event);
      if (!groupId) {
        logger.warn(
          {
            eventId: event.eventId,
            eventTime: event.eventTime,
          },
          "Couldn't extract groupId from event, check event payload and extraction logic"
        );
        continue;
      }

      const defaultGroupDetails: Partial<HistoryEventsGroup> = {
        events: [],
        hasMissingEvents: false,
        label: '',
      };
      const currentGroup = groups[groupId] || defaultGroupDetails;
      const updatedEventsArr = placeEventInGroupEvents(
        event,
        currentGroup.events
      );

      if (updatedEventsArr.every(isExtendedActivityEvent)) {
        groups[groupId] = getActivityGroupFromEvents(updatedEventsArr);
      } else if (updatedEventsArr.every(isExtendedDecisionEvent)) {
        // If there are more than 2 decision events, filter out the pending decision task start event
        // Pending decision task start event is only added to the group when the scheduled decision task event is added
        // This logic can be moved later to getDecisionGroupFromEvents
        const filteredDecisionEvents =
          updatedEventsArr.length > 2
            ? updatedEventsArr.filter(
                (e) =>
                  e.attributes !== 'pendingDecisionTaskStartEventAttributes'
              )
            : updatedEventsArr;
        groups[groupId] = getDecisionGroupFromEvents(filteredDecisionEvents);
      } else if (updatedEventsArr.every(isTimerEvent)) {
        groups[groupId] = getTimerGroupFromEvents(updatedEventsArr);
      } else if (updatedEventsArr.every(isChildWorkflowExecutionEvent)) {
        groups[groupId] =
          getChildWorkflowExecutionGroupFromEvents(updatedEventsArr);
      } else if (
        updatedEventsArr.every(isSignalExternalWorkflowExecutionEvent)
      ) {
        groups[groupId] =
          getSignalExternalWorkflowExecutionGroupFromEvents(updatedEventsArr);
      } else if (
        updatedEventsArr.every(isRequestCancelExternalWorkflowExecutionEvent)
      ) {
        groups[groupId] =
          getRequestCancelExternalWorkflowExecutionGroupFromEvents(
            updatedEventsArr
          );
      } else if (updatedEventsArr.every(isSingleEvent)) {
        groups[groupId] = getSingleEventGroupFromEvents(updatedEventsArr);
      } else {
        logger.warn(
          {
            eventId: event.eventId,
            eventTime: event.eventTime,
            events: updatedEventsArr.map(({ eventId, eventTime }) => ({
              eventId,
              eventTime,
            })),
          },
          'No handler for grouping this event'
        );
      }
    }

    return groups;
  }

  /**
   * Adds a pending activity to a group, removing any existing pending activities first.
   * Only adds the new pending activity if it has an eventTime.
   */
  private addPendingActivityToGroup(
    groupId: string,
    pendingActivity: PendingActivityTaskStartEvent
  ) {
    const currentGroup = this.groups[groupId];
    if (currentGroup && currentGroup.events.every(isExtendedActivityEvent)) {
      const filteredEvents = currentGroup.events.filter(
        (e) => e.attributes !== 'pendingActivityTaskStartEventAttributes'
      ) as ExtendedActivityHistoryEvent[];

      this.groups[groupId] = getActivityGroupFromEvents([
        ...filteredEvents,
        pendingActivity as ExtendedActivityHistoryEvent,
      ]);
    }
  }

  /**
   * Adds a pending decision to a group, removing any existing pending decision first.
   * Only adds if the group has exactly one scheduled event.
   */
  private updatePendingDecisionInGroup(
    groupId: string,
    pendingDecision: PendingDecisionTaskStartEvent | null
  ) {
    const currentGroup = this.groups[groupId];
    if (currentGroup && currentGroup.events.every(isExtendedDecisionEvent)) {
      // Remove any existing pending decision
      const filteredEvents = currentGroup.events.filter(
        (e) => e.attributes !== 'pendingDecisionTaskStartEventAttributes'
      ) as ExtendedDecisionHistoryEvent[];

      // Only add pending decision if group has exactly one scheduled event
      if (
        pendingDecision &&
        filteredEvents.length === 1 &&
        filteredEvents[0].attributes === 'decisionTaskScheduledEventAttributes'
      ) {
        const updatedEventsArr: ExtendedDecisionHistoryEvent[] = [
          ...filteredEvents,
          pendingDecision,
        ];
        this.groups[groupId] = getDecisionGroupFromEvents(updatedEventsArr);
      } else {
        // Just update without pending decision
        this.groups[groupId] = getDecisionGroupFromEvents(filteredEvents);
      }
    }
  }

  /**
   * Updates pending activities and decisions.
   */
  private processPendingEvents(
    currentPendingActivities: PendingActivityTaskStartEvent[],
    newPendingActivities: PendingActivityTaskStartEvent[],
    currentPendingDecision: PendingDecisionTaskStartEvent | null,
    newPendingDecision: PendingDecisionTaskStartEvent | null
  ) {
    this.updatePendingActivities(
      currentPendingActivities,
      newPendingActivities
    );

    this.updatePendingDecision(currentPendingDecision, newPendingDecision);
  }

  /**
   * Updates pending activities in groups by removing old ones and adding new ones.
   * If a group doesn't exist yet, buffers the pending activity until the
   * scheduled event arrives.
   * Buffer is already cleared before this is called, so we're rebuilding from scratch.
   */
  private updatePendingActivities(
    currentPendingActivities: PendingActivityTaskStartEvent[],
    newPendingActivities: PendingActivityTaskStartEvent[]
  ): void {
    const existingPendingGroups = new Set(
      currentPendingActivities.map((pa) => getHistoryEventGroupId(pa))
    );
    // First, remove all current pending activities from their groups
    currentPendingActivities.forEach((pa) => {
      const groupId = getHistoryEventGroupId(pa);
      if (groupId && existingPendingGroups.has(groupId)) {
        const currentGroup = this.groups[groupId];
        if (
          currentGroup &&
          currentGroup.events.every(isExtendedActivityEvent)
        ) {
          const filteredEvents = currentGroup.events.filter(
            (e) => e.attributes !== 'pendingActivityTaskStartEventAttributes'
          );

          this.groups[groupId] = getActivityGroupFromEvents(filteredEvents);
        }
      }
    });

    // Then, add all new pending activities to their groups (or buffer them)
    newPendingActivities.forEach((pa) => {
      const groupId = getHistoryEventGroupId(pa);
      if (!groupId) {
        logger.warn(
          {
            computedEventId: pa.computedEventId,
            eventTime: pa.eventTime,
          },
          "Couldn't extract groupId from pending activity event"
        );
        return;
      }

      if (this.groups[groupId]) {
        this.addPendingActivityToGroup(groupId, pa);
      } else {
        this.bufferedPendingActivities.push(pa);
      }
    });
  }

  /**
   * Adds the current pending decision to groups.
   * If the group doesn't exist yet, buffers the pending decision until the
   * scheduled event arrives.
   * Buffer was cleared before this is called, so we're rebuilding from scratch.
   */
  private updatePendingDecision(
    currentPendingDecision: PendingDecisionTaskStartEvent | null,
    newPendingDecision: PendingDecisionTaskStartEvent | null
  ): void {
    // Remove old pending decision from its group (if exists)
    if (currentPendingDecision) {
      const groupId = getHistoryEventGroupId(currentPendingDecision);
      if (groupId) {
        this.updatePendingDecisionInGroup(groupId, null);
      }
    }

    // Add new pending decision (to group or buffer)
    if (newPendingDecision) {
      const groupId = getHistoryEventGroupId(newPendingDecision);
      if (!groupId) {
        logger.warn(
          {
            computedEventId: newPendingDecision.computedEventId,
            eventTime: newPendingDecision.eventTime,
          },
          "Couldn't extract groupId from pending decision event"
        );
        return;
      }

      if (this.groups[groupId]) {
        this.updatePendingDecisionInGroup(groupId, newPendingDecision);
      } else {
        this.bufferedPendingDecision = newPendingDecision;
      }
    }
  }

  /**
   * Applies buffered pending events to groups when their scheduled events arrive.
   * This is called after processing new events to merge any pending events
   * that were waiting for their groups to be created.
   */
  private applyBufferedPendingEvents(): void {
    // Apply buffered pending activities
    const activitiesToKeepBuffered: PendingActivityTaskStartEvent[] = [];

    this.bufferedPendingActivities.forEach((activity) => {
      const groupId = getHistoryEventGroupId(activity);
      if (groupId && this.groups[groupId]) {
        this.addPendingActivityToGroup(groupId, activity);
      } else {
        activitiesToKeepBuffered.push(activity);
      }
    });

    this.bufferedPendingActivities = activitiesToKeepBuffered;

    // Apply buffered pending decision
    if (this.bufferedPendingDecision) {
      const groupId = getHistoryEventGroupId(this.bufferedPendingDecision);
      if (groupId) {
        // Try to add to existing group using helper
        if (this.groups[groupId]) {
          this.updatePendingDecisionInGroup(
            groupId,
            this.bufferedPendingDecision
          );
          this.bufferedPendingDecision = null;
        }
      }
    }
  }
}
