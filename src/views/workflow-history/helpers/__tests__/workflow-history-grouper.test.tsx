import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

import {
  completedActivityTaskEvents,
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
} from '../../__fixtures__/workflow-history-activity-events';
import {
  completedDecisionTaskEvents,
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
} from '../../__fixtures__/workflow-history-decision-events';
import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskStartEvent,
} from '../../__fixtures__/workflow-history-pending-events';
import type {
  ActivityHistoryGroup,
  PendingActivityTaskStartEvent,
  PendingDecisionTaskStartEvent,
} from '../../workflow-history.types';
import WorkflowHistoryGrouper from '../workflow-history-grouper';
import type { Props } from '../workflow-history-grouper.types';

// Create pending decision that matches the scheduleDecisionTaskEvent (eventId: '2')
const pendingDecisionForScheduledEvent = {
  ...pendingDecisionTaskStartEvent,
  computedEventId: 'pending-2',
  pendingDecisionTaskStartEventAttributes: {
    ...pendingDecisionTaskStartEvent.pendingDecisionTaskStartEventAttributes,
    scheduleId: '2',
  },
} as const satisfies PendingDecisionTaskStartEvent;

// Helper to create a grouper with a mock onChange
function createGrouper(options: Partial<Props> = {}) {
  const onChange = jest.fn();
  const grouper = new WorkflowHistoryGrouper({
    onChange,
    ...options,
  });
  return { grouper, onChange };
}

// Helper to wait for processing to complete
function waitForProcessing(onChange: jest.Mock, timeout = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkComplete = () => {
      // Check if onChange was called with status 'idle' or 'error'
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
      if (
        lastCall &&
        (lastCall[0].status === 'idle' || lastCall[0].status === 'error')
      ) {
        resolve();
        return;
      }

      // Check timeout
      if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for processing to complete'));
        return;
      }

      // Check again soon
      setTimeout(checkComplete, 10);
    };

    // Start checking after a short delay to let updateEvents kick off
    setTimeout(checkComplete, 10);
  });
}

describe(WorkflowHistoryGrouper.name, () => {
  describe('basic event processing', () => {
    it('should process events and create groups', async () => {
      const { grouper, onChange } = createGrouper();

      grouper.updateEvents(completedActivityTaskEvents as HistoryEvent[]);
      await waitForProcessing(onChange);

      const groups = grouper.getGroups();
      expect(groups).toBeDefined();
      expect(groups['7']).toBeDefined();
      expect(groups['7'].groupType).toBe('Activity');
      expect(grouper.getLastProcessedEventIndex()).toBe(2);
    });

    it('should not reprocess events on subsequent calls with same events', async () => {
      const { grouper, onChange } = createGrouper();

      // First call
      grouper.updateEvents(completedActivityTaskEvents as HistoryEvent[]);
      await waitForProcessing(onChange);

      const initialGroups = grouper.getGroups();
      const initialIndex = grouper.getLastProcessedEventIndex();

      // Second call with same events - should not trigger processing
      grouper.updateEvents(completedActivityTaskEvents as HistoryEvent[]);
      // Give it a moment, but don't wait for onChange since nothing should happen
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(grouper.getGroups()).toEqual(initialGroups);
      expect(grouper.getLastProcessedEventIndex()).toBe(initialIndex);
    });

    it('should process only new events on subsequent calls', async () => {
      const { grouper, onChange } = createGrouper();

      // First call with partial events
      grouper.updateEvents([
        scheduleActivityTaskEvent,
        startActivityTaskEvent,
      ] as HistoryEvent[]);
      await waitForProcessing(onChange);

      expect(grouper.getLastProcessedEventIndex()).toBe(1);

      // Second call with all events
      onChange.mockClear();
      grouper.updateEvents(completedActivityTaskEvents as HistoryEvent[]);
      await waitForProcessing(onChange);

      const groups = grouper.getGroups();
      expect(grouper.getLastProcessedEventIndex()).toBe(2);
      expect(groups['7']).toBeDefined();
      expect((groups['7'] as ActivityHistoryGroup).events).toHaveLength(3);
    });
  });

  describe('pending activities management', () => {
    it('should add new pending activities to groups', async () => {
      const { grouper, onChange } = createGrouper();

      // First call with scheduled event only
      grouper.updateEvents([scheduleActivityTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Update with pending activity
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      const groups = grouper.getGroups();
      const activityGroup = groups['7'] as ActivityHistoryGroup;
      expect(activityGroup.events).toHaveLength(2);
      expect(activityGroup.events[1].attributes).toBe(
        'pendingActivityTaskStartEventAttributes'
      );
    });

    it('should remove stale pending activities from groups', async () => {
      const { grouper, onChange } = createGrouper();

      // First call with pending activity
      grouper.updateEvents([scheduleActivityTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      const firstGroups = grouper.getGroups();
      const firstActivityGroup = firstGroups['7'] as ActivityHistoryGroup;
      expect(firstActivityGroup.events).toHaveLength(2);

      // Second call without pending activity (it completed)
      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: null,
      });

      const groups = grouper.getGroups();
      const activityGroup = groups['7'] as ActivityHistoryGroup;
      expect(activityGroup.events).toHaveLength(1);
      expect(activityGroup.events[0].attributes).toBe(
        'activityTaskScheduledEventAttributes'
      );
    });

    it('should handle multiple pending activity state transitions', async () => {
      const { grouper, onChange } = createGrouper();

      // Initial state
      grouper.updateEvents([scheduleActivityTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Add pending activity
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      // Remove pending activity (it started)
      onChange.mockClear();
      grouper.updateEvents([
        scheduleActivityTaskEvent,
        startActivityTaskEvent,
      ] as HistoryEvent[]);
      await waitForProcessing(onChange);

      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: null,
      });

      const activityGroup = grouper.getGroups()['7'] as ActivityHistoryGroup;
      expect(activityGroup.events).toHaveLength(2);
      expect(
        activityGroup.events.some(
          (e) => e.attributes === 'pendingActivityTaskStartEventAttributes'
        )
      ).toBe(false);
    });
  });

  describe('pending decision management', () => {
    it('should add new pending decision to groups', async () => {
      const { grouper, onChange } = createGrouper();

      // First call with scheduled event only
      grouper.updateEvents([scheduleDecisionTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Add pending decision
      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: pendingDecisionForScheduledEvent,
      });

      const decisionGroup = grouper.getGroups()['2'];
      expect(decisionGroup.groupType).toBe('Decision');
      expect(decisionGroup.events).toHaveLength(2);
    });

    it('should remove stale pending decision from groups', async () => {
      const { grouper, onChange } = createGrouper();

      // First call with pending decision
      grouper.updateEvents([scheduleDecisionTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: pendingDecisionForScheduledEvent,
      });

      const firstGroups = grouper.getGroups();
      expect(firstGroups['2'].events).toHaveLength(2);

      // Second call without pending decision (it completed)
      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: null,
      });

      const decisionGroup = grouper.getGroups()['2'];
      expect(decisionGroup.events).toHaveLength(1);
    });
  });

  describe('state management', () => {
    it('should track last processed event index correctly', () => {
      const { grouper } = createGrouper();

      expect(grouper.getLastProcessedEventIndex()).toBe(-1);
    });

    it('should return current groups without processing', () => {
      const { grouper } = createGrouper();

      const groups = grouper.getGroups();

      expect(groups).toEqual({});
    });

    it('should reset grouper state', async () => {
      const { grouper, onChange } = createGrouper();

      // Process some events
      grouper.updateEvents(completedActivityTaskEvents as HistoryEvent[]);
      await waitForProcessing(onChange);

      expect(grouper.getLastProcessedEventIndex()).toBe(2);
      expect(Object.keys(grouper.getGroups()).length).toBeGreaterThan(0);

      // Reset
      grouper.reset();

      expect(grouper.getLastProcessedEventIndex()).toBe(-1);
      expect(grouper.getGroups()).toEqual({});
    });

    it('should reprocess events after reset', async () => {
      const { grouper, onChange } = createGrouper();

      // Process events
      grouper.updateEvents(completedActivityTaskEvents as HistoryEvent[]);
      await waitForProcessing(onChange);

      const firstGroups = grouper.getGroups();

      // Reset and reprocess
      grouper.reset();
      onChange.mockClear();
      grouper.updateEvents(completedActivityTaskEvents as HistoryEvent[]);
      await waitForProcessing(onChange);

      expect(grouper.getGroups()).toEqual(firstGroups);
    });
  });

  describe('pending event buffering', () => {
    it('should buffer pending activity when group does not exist yet', async () => {
      const { grouper, onChange } = createGrouper();

      // Add pending activity BEFORE scheduled event exists
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      // Group should NOT exist yet (pending event is buffered)
      let groups = grouper.getGroups();
      expect(groups['7']).toBeUndefined();

      // Now add the scheduled event
      grouper.updateEvents([scheduleActivityTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Group should now exist with both scheduled and pending events
      groups = grouper.getGroups();
      const activityGroup = groups['7'] as ActivityHistoryGroup;
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
      const { grouper, onChange } = createGrouper();

      // Add pending decision BEFORE scheduled event exists
      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: pendingDecisionForScheduledEvent,
      });

      // Group should NOT exist yet (pending event is buffered)
      let groups = grouper.getGroups();
      expect(groups['2']).toBeUndefined();

      // Now add the scheduled event
      grouper.updateEvents([scheduleDecisionTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Group should now exist with both scheduled and pending events
      groups = grouper.getGroups();
      const decisionGroup = groups['2'];
      expect(decisionGroup).toBeDefined();
      expect(decisionGroup.groupType).toBe('Decision');
      expect(decisionGroup.events).toHaveLength(2);
    });

    it('should handle multiple buffered pending activities', async () => {
      const { grouper, onChange } = createGrouper();

      const pendingActivity1 = {
        ...pendingActivityTaskStartEvent,
        computedEventId: 'pending-7',
        pendingActivityTaskStartEventAttributes: {
          ...pendingActivityTaskStartEvent.pendingActivityTaskStartEventAttributes,
          scheduleId: '7',
        },
      } as const satisfies PendingActivityTaskStartEvent;

      const pendingActivity2 = {
        ...pendingActivityTaskStartEvent,
        computedEventId: 'pending-10',
        pendingActivityTaskStartEventAttributes: {
          ...pendingActivityTaskStartEvent.pendingActivityTaskStartEventAttributes,
          scheduleId: '10',
          activityId: '1',
        },
      } as const satisfies PendingActivityTaskStartEvent;

      const scheduleEvent2 = {
        ...scheduleActivityTaskEvent,
        eventId: '10',
        activityTaskScheduledEventAttributes: {
          ...scheduleActivityTaskEvent.activityTaskScheduledEventAttributes,
          activityId: '1',
        },
      };

      // Add multiple pending activities BEFORE their scheduled events
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivity1, pendingActivity2],
        pendingStartDecision: null,
      });

      // No groups should exist yet
      expect(Object.keys(grouper.getGroups()).length).toBe(0);

      // Add first scheduled event
      grouper.updateEvents([scheduleActivityTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // First group should now exist
      let groups = grouper.getGroups();
      expect(groups['7']).toBeDefined();
      expect(groups['10']).toBeUndefined();

      // Add second scheduled event
      onChange.mockClear();
      grouper.updateEvents([
        scheduleActivityTaskEvent,
        scheduleEvent2,
      ] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Both groups should now exist
      groups = grouper.getGroups();
      expect(groups['7']).toBeDefined();
      expect(groups['10']).toBeDefined();
      expect((groups['7'] as ActivityHistoryGroup).events).toHaveLength(2);
      expect((groups['10'] as ActivityHistoryGroup).events).toHaveLength(2);
    });

    it('should clear buffer when pending events are updated', async () => {
      const { grouper } = createGrouper();

      const pendingActivity1 = {
        ...pendingActivityTaskStartEvent,
        computedEventId: 'pending-7',
      } as const satisfies PendingActivityTaskStartEvent;

      const pendingActivity2 = {
        ...pendingActivityTaskStartEvent,
        computedEventId: 'pending-10',
        pendingActivityTaskStartEventAttributes: {
          ...pendingActivityTaskStartEvent.pendingActivityTaskStartEventAttributes,
          scheduleId: '10',
        },
      } as const satisfies PendingActivityTaskStartEvent;

      // Add pending activity that won't have a group
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivity1],
        pendingStartDecision: null,
      });

      // Update with different pending activity (old one should be removed from buffer)
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivity2],
        pendingStartDecision: null,
      });

      // No groups should exist
      expect(Object.keys(grouper.getGroups()).length).toBe(0);
    });

    it('should clear buffer on reset', async () => {
      const { grouper, onChange } = createGrouper();

      // Add pending activity without scheduled event (will be buffered)
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      // Reset the grouper
      grouper.reset();

      // Add scheduled event after reset
      grouper.updateEvents([scheduleActivityTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Group should only have scheduled event (buffered pending was cleared)
      const groups = grouper.getGroups();
      const activityGroup = groups['7'] as ActivityHistoryGroup;
      expect(activityGroup.events).toHaveLength(1);
      expect(activityGroup.events[0].attributes).toBe(
        'activityTaskScheduledEventAttributes'
      );
    });

    it('should apply buffered pending events after updatePendingEvents if groups now exist', async () => {
      const { grouper, onChange } = createGrouper();

      // Add pending activity BEFORE scheduled event (will be buffered)
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      // No group yet
      expect(grouper.getGroups()['7']).toBeUndefined();

      // Process scheduled event
      grouper.updateEvents([scheduleActivityTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Call updatePendingEvents again with same pending activity
      // This should trigger applyBufferedPendingEvents and merge the buffered event
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      // Group should now have both events
      const groups = grouper.getGroups();
      const activityGroup = groups['7'] as ActivityHistoryGroup;
      expect(activityGroup.events).toHaveLength(2);
    });

    it('should handle scenario where scheduled event arrives after pending event update', async () => {
      const { grouper, onChange } = createGrouper();

      // Step 1: Pending activity arrives first (buffered)
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      // Step 2: Scheduled event arrives
      grouper.updateEvents([scheduleActivityTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Step 3: Another updatePendingEvents call (maybe with different pending events)
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      // Should have complete group with both events
      const groups = grouper.getGroups();
      const activityGroup = groups['7'] as ActivityHistoryGroup;
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
      const { grouper } = createGrouper();

      // Only add pending activity (no scheduled event)
      await grouper.updatePendingEvents({
        pendingStartActivities: [pendingActivityTaskStartEvent],
        pendingStartDecision: null,
      });

      // Group should NOT exist in the UI
      const groups = grouper.getGroups();
      expect(groups['7']).toBeUndefined();
      expect(Object.keys(groups).length).toBe(0);
    });

    it('should handle pending decision buffer clearing when decision changes', async () => {
      const { grouper } = createGrouper();

      const pendingDecision1 = {
        ...pendingDecisionTaskStartEvent,
        computedEventId: 'pending-7',
      } as const satisfies PendingDecisionTaskStartEvent;

      const pendingDecision2 = {
        ...pendingDecisionTaskStartEvent,
        computedEventId: 'pending-10',
        pendingDecisionTaskStartEventAttributes: {
          ...pendingDecisionTaskStartEvent.pendingDecisionTaskStartEventAttributes,
          scheduleId: '10',
        },
      } as const satisfies PendingDecisionTaskStartEvent;

      // Buffer first decision
      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: pendingDecision1,
      });

      // Update with different decision (old one should be removed from buffer)
      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: pendingDecision2,
      });

      // No groups should exist
      expect(Object.keys(grouper.getGroups()).length).toBe(0);
    });
  });

  describe('decision group filtering', () => {
    it('should filter out pending decision when decision group has more than 2 events', async () => {
      const { grouper, onChange } = createGrouper();

      // Add scheduled event and pending decision
      grouper.updateEvents([scheduleDecisionTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: pendingDecisionForScheduledEvent,
      });

      // Group should have 2 events (scheduled + pending)
      let groups = grouper.getGroups();
      expect(groups['2'].events).toHaveLength(2);

      // Now add started event (makes it 3 events total)
      onChange.mockClear();
      grouper.updateEvents([
        scheduleDecisionTaskEvent,
        startDecisionTaskEvent,
      ] as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Pending decision should be filtered out when there are more than 2 events
      groups = grouper.getGroups();
      expect(groups['2'].events).toHaveLength(2);
      expect(
        groups['2'].events.some(
          (e) => e.attributes === 'pendingDecisionTaskStartEventAttributes'
        )
      ).toBe(false);

      // Add completed event (makes it 3+ events)
      onChange.mockClear();
      grouper.updateEvents(completedDecisionTaskEvents as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Still should not have pending decision
      groups = grouper.getGroups();
      expect(groups['2'].events).toHaveLength(3);
      expect(
        groups['2'].events.some(
          (e) => e.attributes === 'pendingDecisionTaskStartEventAttributes'
        )
      ).toBe(false);
    });

    it('should keep pending decision when decision group has exactly 2 events', async () => {
      const { grouper, onChange } = createGrouper();

      // Add scheduled event and pending decision
      grouper.updateEvents([scheduleDecisionTaskEvent] as HistoryEvent[]);
      await waitForProcessing(onChange);

      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: pendingDecisionForScheduledEvent,
      });

      // Group should have 2 events (scheduled + pending)
      const groups = grouper.getGroups();
      expect(groups['2'].events).toHaveLength(2);
      expect(
        groups['2'].events.some(
          (e) => e.attributes === 'pendingDecisionTaskStartEventAttributes'
        )
      ).toBe(true);
    });
  });

  describe('groups shallow copy in onChange', () => {
    it('should return shallow copy of groups object in onChange callback', async () => {
      const { grouper, onChange } = createGrouper();

      grouper.updateEvents(completedActivityTaskEvents as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Get groups from onChange callback
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
      const groupsFromCallback = lastCall[0].currentGroups;

      // Try to add a new group to the callback's groups object
      groupsFromCallback['999'] = groupsFromCallback['7'];

      // Internal groups should not have the new group (shallow copy protects object structure)
      const internalGroups = grouper.getGroups();
      expect(internalGroups['999']).toBeUndefined();
    });

    it('should allow modification of group properties (shallow copy limitation)', async () => {
      const { grouper, onChange } = createGrouper();

      grouper.updateEvents(completedActivityTaskEvents as HistoryEvent[]);
      await waitForProcessing(onChange);

      // Get groups from onChange callback
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
      const groupsFromCallback = lastCall[0].currentGroups;
      const originalLabel = groupsFromCallback['7'].label;

      // Modify a group's property - this WILL affect internal state (shallow copy limitation)
      groupsFromCallback['7'].label = 'Modified Label';

      // Internal groups ARE modified since group objects are shared references
      const internalGroups = grouper.getGroups();
      expect(internalGroups['7'].label).toBe('Modified Label');
      expect(internalGroups['7'].label).not.toBe(originalLabel);
    });
  });
});
