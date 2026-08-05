import {
  completedActivityTaskEvents,
  startActivityTaskEvent,
} from '../../__fixtures__/workflow-history-activity-events';
import { startDecisionTaskEvent } from '../../__fixtures__/workflow-history-decision-events';
import {
  createPendingActivity,
  createPendingDecision,
  createScheduleActivityEvent,
  createScheduleDecisionEvent,
  pendingActivityTaskStartEvent,
} from '../../__fixtures__/workflow-history-pending-events';
import WorkflowHistoryGrouper from '../workflow-history-grouper';
import type {
  GroupingStateChangeCallback,
  Props,
} from '../workflow-history-grouper.types';

// Track all setups for cleanup
const allCleanups: Array<() => void> = [];

describe(WorkflowHistoryGrouper.name, () => {
  afterEach(async () => {
    // Clean up any pending timeouts from all tests
    allCleanups.forEach((cleanup) => cleanup());
    allCleanups.length = 0;

    // Give time for any pending async operations to complete
    await new Promise((resolve) => setTimeout(resolve, 10));
  });

  it('should process events and create groups', async () => {
    const { grouper, waitForProcessing } = setup();

    grouper.updateEvents(completedActivityTaskEvents);
    await waitForProcessing();

    const groups = grouper.getState().groups;
    expect(groups).toBeDefined();
    expect(groups['7']).toBeDefined();
    expect(groups['7'].groupType).toBe('Activity');
    expect(grouper.getLastProcessedEventIndex()).toBe(2);
  });

  it('should have getLastProcessedEventIndex pointing to the last processed event', async () => {
    const { grouper, waitForProcessing } = setup();
    expect(grouper.getLastProcessedEventIndex()).toBe(-1);

    // First call with partial events
    grouper.updateEvents([
      completedActivityTaskEvents[0],
      completedActivityTaskEvents[1],
    ]);
    await waitForProcessing();

    expect(grouper.getLastProcessedEventIndex()).toBe(1);

    // Second call with all events
    grouper.updateEvents(completedActivityTaskEvents);
    await waitForProcessing();

    expect(grouper.getLastProcessedEventIndex()).toBe(2);
  });

  it('should add new pending activities to groups', async () => {
    const { grouper, waitForProcessing } = setup();

    // First call with scheduled event only
    grouper.updateEvents([createScheduleActivityEvent('7')]);
    await waitForProcessing();

    // Update with pending activity
    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    const groups = grouper.getState().groups;
    const activityGroup = groups['7'];
    expect(activityGroup.events).toHaveLength(2);
    expect(activityGroup.events[1].attributes).toBe(
      'pendingActivityTaskStartEventAttributes'
    );
  });

  it('should add new pending decision to groups', async () => {
    const { grouper, waitForProcessing } = setup();

    // First call with scheduled event only
    grouper.updateEvents([createScheduleDecisionEvent('2')]);
    await waitForProcessing();

    // Add pending decision
    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: createPendingDecision('2'),
    });

    const decisionGroup = grouper.getState().groups['2'];
    expect(decisionGroup.groupType).toBe('Decision');
    expect(decisionGroup.events).toHaveLength(2);
  });

  it('should remove stale pending activities from groups', async () => {
    const { grouper, waitForProcessing } = setup();

    // First call with pending activity
    grouper.updateEvents([createScheduleActivityEvent('7')]);
    await waitForProcessing();

    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    const firstGroups = grouper.getState().groups;
    const firstActivityGroup = firstGroups['7'];
    expect(firstActivityGroup.events).toHaveLength(2);

    // Second call without pending activity (it completed)
    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: null,
    });

    const groups = grouper.getState().groups;
    const activityGroup = groups['7'];
    expect(activityGroup.events).toHaveLength(1);
    expect(activityGroup.events[0].attributes).toBe(
      'activityTaskScheduledEventAttributes'
    );
  });

  it('should remove stale pending decision from groups', async () => {
    const { grouper, waitForProcessing } = setup();

    // First call with pending decision
    grouper.updateEvents([createScheduleDecisionEvent('2')]);
    await waitForProcessing();

    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: createPendingDecision('2'),
    });

    const firstGroups = grouper.getState().groups;
    expect(firstGroups['2'].events).toHaveLength(2);

    // Second call without pending decision (it completed)
    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: null,
    });

    const decisionGroup = grouper.getState().groups['2'];
    expect(decisionGroup.events).toHaveLength(1);
  });

  it('should handle multiple pending activity state transitions', async () => {
    const { grouper, waitForProcessing } = setup();

    // Initial state
    grouper.updateEvents([createScheduleActivityEvent('7')]);
    await waitForProcessing();

    // Add pending activity
    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    // Remove pending activity (it started)
    grouper.updateEvents([
      createScheduleActivityEvent('7'),
      startActivityTaskEvent,
    ]);
    await waitForProcessing();

    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: null,
    });

    const activityGroup = grouper.getState().groups['7'];
    expect(activityGroup.events).toHaveLength(2);
    expect(
      activityGroup.events.some(
        (e) => e.attributes === 'pendingActivityTaskStartEventAttributes'
      )
    ).toBe(false);
  });

  it('should return current groups without processing', () => {
    const { grouper } = setup();

    const groups = grouper.getState().groups;

    expect(groups).toEqual({});
  });

  it('should reset grouper state', async () => {
    const { grouper, waitForProcessing } = setup();

    // Process some events
    grouper.updateEvents(completedActivityTaskEvents);
    await waitForProcessing();

    expect(grouper.getLastProcessedEventIndex()).toBe(2);
    expect(Object.keys(grouper.getState().groups).length).toBeGreaterThan(0);

    // Reset
    grouper.reset();

    expect(grouper.getLastProcessedEventIndex()).toBe(-1);
    expect(grouper.getState().groups).toEqual({});
  });

  it('should reprocess events after reset', async () => {
    const { grouper, waitForProcessing } = setup();

    // Process events
    grouper.updateEvents(completedActivityTaskEvents);
    await waitForProcessing();

    const firstGroups = grouper.getState().groups;

    // Reset and reprocess
    grouper.reset();
    expect(grouper.getState().groups).toEqual({});

    grouper.updateEvents(completedActivityTaskEvents);
    await waitForProcessing();

    expect(grouper.getState().groups).toEqual(firstGroups);
  });

  it('should buffer pending activity when group does not exist yet', async () => {
    const { grouper, waitForProcessing } = setup();

    // Add pending activity BEFORE scheduled event exists
    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    // Group should NOT exist yet (pending event is buffered)
    let groups = grouper.getState().groups;
    expect(groups['7']).toBeUndefined();

    // Now add the scheduled event
    grouper.updateEvents([createScheduleActivityEvent('7')]);
    await waitForProcessing();

    // Group should now exist with both scheduled and pending events
    groups = grouper.getState().groups;
    const activityGroup = groups['7'];
    expect(activityGroup).toBeDefined();
    expect(activityGroup.events).toHaveLength(2);
    expect(activityGroup.events[0].attributes).toBe(
      'activityTaskScheduledEventAttributes'
    );
    expect(activityGroup.events[1].attributes).toBe(
      'pendingActivityTaskStartEventAttributes'
    );
  });

  it('should buffer pending decision when group does not exist yet', async () => {
    const { grouper, waitForProcessing } = setup();

    // Add pending decision BEFORE scheduled event exists
    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: createPendingDecision('2'),
    });

    // Group should NOT exist yet (pending event is buffered)
    let groups = grouper.getState().groups;
    expect(groups['2']).toBeUndefined();

    // Now add the scheduled event
    grouper.updateEvents([createScheduleDecisionEvent('2')]);
    await waitForProcessing();

    // Group should now exist with both scheduled and pending events
    groups = grouper.getState().groups;
    const decisionGroup = groups['2'];
    expect(decisionGroup).toBeDefined();
    expect(decisionGroup.groupType).toBe('Decision');
    expect(decisionGroup.events).toHaveLength(2);
  });

  it('should handle multiple buffered pending activities', async () => {
    const { grouper, waitForProcessing } = setup();

    // Add multiple pending activities BEFORE their scheduled events
    await grouper.updatePendingEvents({
      pendingStartActivities: [
        createPendingActivity('7'),
        createPendingActivity('10', { activityId: '1' }),
      ],
      pendingStartDecision: null,
    });

    // No groups should exist yet
    expect(Object.keys(grouper.getState().groups).length).toBe(0);

    // Add first scheduled event
    grouper.updateEvents([createScheduleActivityEvent('7')]);
    await waitForProcessing();

    // First group should now exist
    let groups = grouper.getState().groups;
    expect(groups['7']).toBeDefined();
    expect(groups['10']).toBeUndefined();

    // Add second scheduled event
    grouper.updateEvents([
      createScheduleActivityEvent('7'),
      createScheduleActivityEvent('10', { activityId: '1' }),
    ]);
    await waitForProcessing();

    // Both groups should now exist
    groups = grouper.getState().groups;
    expect(groups['7']).toBeDefined();
    expect(groups['10']).toBeDefined();
    expect(groups['7'].events).toHaveLength(2);
    expect(groups['10'].events).toHaveLength(2);
  });

  it('should clear pending activities buffer when pending events are updated', async () => {
    const { grouper, waitForProcessing } = setup();

    // Buffer first pending activity for scheduleId: '7'
    await grouper.updatePendingEvents({
      pendingStartActivities: [createPendingActivity('7')],
      pendingStartDecision: null,
    });

    // Update with different pending activity for scheduleId: '10' (old one should be removed from buffer)
    await grouper.updatePendingEvents({
      pendingStartActivities: [
        createPendingActivity('10', { activityId: '1' }),
      ],
      pendingStartDecision: null,
    });

    // No groups should exist yet (still buffered)
    expect(Object.keys(grouper.getState().groups).length).toBe(0);

    // Now add scheduled events for both activities
    grouper.updateEvents([
      createScheduleActivityEvent('7'), // scheduleId: '7'
      createScheduleActivityEvent('10', { activityId: '1' }), // scheduleId: '10'
    ]);
    await waitForProcessing();

    const groups = grouper.getState().groups;

    // Group '7' should only have scheduled event (pending was cleared from buffer)
    expect(groups['7']).toBeDefined();
    expect(groups['7'].events).toHaveLength(1);
    expect(
      groups['7'].events.some(
        (e) => e.attributes === 'pendingActivityTaskStartEventAttributes'
      )
    ).toBe(false);

    // Group '10' should have both scheduled and pending events (current pending in buffer)
    expect(groups['10']).toBeDefined();
    expect(groups['10'].events).toHaveLength(2);
    expect(
      groups['10'].events.some(
        (e) => e.attributes === 'pendingActivityTaskStartEventAttributes'
      )
    ).toBe(true);
  });

  it('should clear buffer on reset', async () => {
    const { grouper, waitForProcessing } = setup();

    // Add pending activity without scheduled event (will be buffered)
    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    // Reset the grouper
    grouper.reset();

    // Add scheduled event after reset
    grouper.updateEvents([createScheduleActivityEvent('7')]);
    await waitForProcessing();

    // Group should only have scheduled event (buffered pending was cleared)
    const groups = grouper.getState().groups;
    const activityGroup = groups['7'];
    expect(activityGroup.events).toHaveLength(1);
    expect(activityGroup.events[0].attributes).toBe(
      'activityTaskScheduledEventAttributes'
    );
  });

  it('should apply buffered pending events after updatePendingEvents if groups now exist', async () => {
    const { grouper, waitForProcessing } = setup();

    // Add pending activity BEFORE scheduled event (will be buffered)
    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    // No group yet
    expect(grouper.getState().groups['7']).toBeUndefined();

    // Process scheduled event
    grouper.updateEvents([createScheduleActivityEvent('7')]);
    await waitForProcessing();

    // Call updatePendingEvents again with same pending activity
    // This should trigger applyBufferedPendingEvents and merge the buffered event
    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    // Group should now have both events
    const groups = grouper.getState().groups;
    const activityGroup = groups['7'];
    expect(activityGroup.events).toHaveLength(2);
  });

  it('should handle scenario where scheduled event arrives after pending event update', async () => {
    const { grouper, waitForProcessing } = setup();

    // Step 1: Pending activity arrives first (buffered)
    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    // Step 2: Scheduled event arrives
    grouper.updateEvents([createScheduleActivityEvent('7')]);
    await waitForProcessing();

    // Should have complete group with both events
    const groups = grouper.getState().groups;
    const activityGroup = groups['7'];
    expect(activityGroup).toBeDefined();
    expect(activityGroup.events).toHaveLength(2);
    expect(activityGroup.events[0].attributes).toBe(
      'activityTaskScheduledEventAttributes'
    );
    expect(activityGroup.events[1].attributes).toBe(
      'pendingActivityTaskStartEventAttributes'
    );
  });

  it('should not create incomplete groups when pending arrives before scheduled', async () => {
    const { grouper } = setup();

    // Only add pending activity (no scheduled event)
    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    // Group should NOT exist in the UI
    const groups = grouper.getState().groups;
    expect(groups['7']).toBeUndefined();
    expect(Object.keys(groups).length).toBe(0);
  });

  it('should notify subscribers after pending events are processed', async () => {
    const { grouper, waitForProcessing } = setup();
    const scheduledEvent = createScheduleActivityEvent('7');
    grouper.updateEvents([scheduledEvent]);
    await waitForProcessing();
    // subscribe to state changes
    const mockOnChange = jest.fn();
    grouper.onChange(mockOnChange);
    // add pending event on history after scheduled event is processed and onChange is subscribed
    await grouper.updatePendingEvents({
      pendingStartActivities: [pendingActivityTaskStartEvent],
      pendingStartDecision: null,
    });

    await waitForProcessing();
    expect(mockOnChange).toHaveBeenCalled();

    const callArgs = mockOnChange.mock.calls[0][0];
    expect(callArgs.groups['7']).toBeDefined();
    expect(callArgs.groups['7'].events).toEqual([
      scheduledEvent,
      pendingActivityTaskStartEvent,
    ]);
  });

  it('should handle pending decision buffer clearing when decision changes', async () => {
    const { grouper, waitForProcessing } = setup();

    // Buffer first decision for scheduleId: '2'
    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: createPendingDecision('2'),
    });

    // Update with different decision for scheduleId: '10' (old one should be removed from buffer)
    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: createPendingDecision('10'),
    });

    // No groups should exist yet (still buffered)
    expect(Object.keys(grouper.getState().groups).length).toBe(0);

    // Now add scheduled events for both decisions
    grouper.updateEvents([
      createScheduleDecisionEvent('2'), // scheduleId: '2'
      createScheduleDecisionEvent('10'), // scheduleId: '10'
    ]);
    await waitForProcessing();

    const groups = grouper.getState().groups;

    // Group '2' should only have scheduled event (pending was cleared from buffer)
    expect(groups['2']).toBeDefined();
    expect(groups['2'].events).toHaveLength(1);
    expect(
      groups['2'].events.some(
        (e) => e.attributes === 'pendingDecisionTaskStartEventAttributes'
      )
    ).toBe(false);

    // Group '10' should have both scheduled and pending events (current pending in buffer)
    expect(groups['10']).toBeDefined();
    expect(groups['10'].events).toHaveLength(2);
    expect(
      groups['10'].events.some(
        (e) => e.attributes === 'pendingDecisionTaskStartEventAttributes'
      )
    ).toBe(true);
  });

  it('should filter out pending decision when decision group has more than 2 events', async () => {
    const { grouper, waitForProcessing } = setup();

    // Add scheduled event and pending decision
    grouper.updateEvents([createScheduleDecisionEvent('2')]);
    await waitForProcessing();

    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: createPendingDecision('2'),
    });

    // Group should have 2 events (scheduled + pending)
    let groups = grouper.getState().groups;
    expect(groups['2'].events).toHaveLength(2);

    // Now add started event (makes it 3 events total)
    grouper.updateEvents([
      createScheduleDecisionEvent('2'),
      startDecisionTaskEvent,
    ]);
    await waitForProcessing();

    // Pending decision should be filtered out when there are more than 2 events
    groups = grouper.getState().groups;
    expect(groups['2'].events).toHaveLength(2);
    expect(
      groups['2'].events.some(
        (e) => e.attributes === 'pendingDecisionTaskStartEventAttributes'
      )
    ).toBe(false);

    // even if pending event is updated again, it should not be added to the group
    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: createPendingDecision('2'),
    });

    groups = grouper.getState().groups;
    expect(groups['2'].events).toHaveLength(2);
    expect(
      groups['2'].events.some(
        (e) => e.attributes === 'pendingDecisionTaskStartEventAttributes'
      )
    ).toBe(false);
  });

  it('should keep pending decision when decision group has exactly 2 events', async () => {
    const { grouper, waitForProcessing } = setup();

    // Add scheduled event and pending decision
    grouper.updateEvents([createScheduleDecisionEvent('2')]);
    await waitForProcessing();

    await grouper.updatePendingEvents({
      pendingStartActivities: [],
      pendingStartDecision: createPendingDecision('2'),
    });

    // Group should have 2 events (scheduled + pending)
    const groups = grouper.getState().groups;
    expect(groups['2'].events).toHaveLength(2);
    expect(
      groups['2'].events.some(
        (e) => e.attributes === 'pendingDecisionTaskStartEventAttributes'
      )
    ).toBe(true);
  });

  it('should clean up all resources when destroy is called', async () => {
    const { grouper, handleStateChange, waitForProcessing } = setup();

    // Process some events and verify onChange is called
    grouper.updateEvents(completedActivityTaskEvents);
    await waitForProcessing();

    expect(handleStateChange).toHaveBeenCalled();
    expect(Object.keys(grouper.getState().groups).length).toBeGreaterThan(0);

    handleStateChange.mockClear();
    // Destroy the grouper
    grouper.destroy();

    // Verify state is reset
    expect(grouper.getState().groups).toEqual({});
    expect(grouper.getLastProcessedEventIndex()).toBe(-1);

    // Process new events - onChange should NOT be called anymore
    grouper.updateEvents(completedActivityTaskEvents);

    // Verify onChange was NOT called after destroy
    expect(handleStateChange).not.toHaveBeenCalled();
  });

  it('should return current state via getState', async () => {
    const { grouper, waitForProcessing } = setup();

    // Initial state - no events processed
    let state = grouper.getState();
    expect(state).toEqual({
      groups: {},
      processedEventsCount: 0,
      remainingEventsCount: 0,
      status: 'idle',
    });

    // Add events - with batchSize=1, first batch will be processed synchronously but subsequent batches will be async
    grouper.updateEvents(completedActivityTaskEvents);

    // Check state after first batch (might be synchronous)
    state = grouper.getState();
    // First batch is processed immediately, so processedEventsCount should be at least 1
    expect(state.processedEventsCount).toBeGreaterThan(0);

    // Wait for processing to complete
    await waitForProcessing();

    // After processing - status should be idle
    state = grouper.getState();
    expect(state).toEqual({
      groups: expect.any(Object),
      processedEventsCount: completedActivityTaskEvents.length,
      remainingEventsCount: 0,
      status: 'idle',
    });
    expect(Object.keys(state.groups).length).toBeGreaterThan(0);

    // Verify getState() returns consistent data
    const anotherState = grouper.getState();
    expect(anotherState.groups).toEqual(state.groups);
  });
});

function setup(options: Partial<Props> = {}) {
  // Queue of promise resolvers/rejecters waiting for processing to complete
  const pendingResolvers: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
    timeoutId: NodeJS.Timeout;
  }> = [];

  // Create state change handler that resolves pending promises when processing completes
  const handleStateChange: jest.MockedFunction<GroupingStateChangeCallback> =
    jest.fn((state) => {
      if (state.status === 'idle') {
        // Resolve all pending promises at once
        pendingResolvers.forEach(({ timeoutId, resolve }) => {
          clearTimeout(timeoutId);
          resolve();
        });
        pendingResolvers.length = 0;
      }
    });

  // Create grouper and subscribe to state changes
  const grouper = new WorkflowHistoryGrouper(options);
  grouper.onChange(handleStateChange);

  // Helper function to wait for next processing cycle
  const waitForProcessing = async (timeout = 1000): Promise<void> => {
    // Check if already idle (processing completed synchronously)
    if (grouper.getState().status === 'idle') {
      return Promise.resolve();
    }

    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        // Remove this resolver from queue if it times out
        const index = pendingResolvers.findIndex(
          (r) => r.timeoutId === timeoutId
        );
        if (index !== -1) {
          pendingResolvers.splice(index, 1);
        }
        reject(new Error('Timeout waiting for processing to complete'));
      }, timeout);

      pendingResolvers.push({ resolve, reject, timeoutId });
    });
  };

  // Cleanup function to clear any pending timeouts and unsubscribe
  const cleanup = () => {
    pendingResolvers.forEach(({ timeoutId }) => clearTimeout(timeoutId));
    pendingResolvers.length = 0;
    grouper.destroy();
  };

  // Register cleanup automatically
  allCleanups.push(cleanup);

  return { grouper, handleStateChange, waitForProcessing };
}
