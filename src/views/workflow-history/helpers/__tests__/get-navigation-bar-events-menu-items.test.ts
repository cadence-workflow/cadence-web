import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import {
  createPendingDecision,
  pendingActivityTaskStartEvent,
  pendingDecisionTaskStartEvent,
} from '../../__fixtures__/workflow-history-pending-events';
import {
  type HistoryEventsGroup,
  type EventGroupEntry,
} from '../../workflow-history.types';
import getNavigationBarEventsMenuItems from '../get-navigation-bar-events-menu-items';
import WorkflowHistoryGrouper from '../workflow-history-grouper';

describe(getNavigationBarEventsMenuItems.name, () => {
  it('should return an empty array when eventGroupsEntries is empty', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [];

    const result = getNavigationBarEventsMenuItems(
      eventGroupsEntries,
      () => true
    );

    expect(result).toEqual([]);
  });

  it('should skip groups with no events', () => {
    const groupWithoutEvents: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [],
    };
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', groupWithoutEvents],
    ];

    const result = getNavigationBarEventsMenuItems(
      eventGroupsEntries,
      () => true
    );

    expect(result).toEqual([]);
  });

  it('should skip groups filtered out by filterFn', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
      ['group2', mockDecisionEventGroup],
    ];
    const filterFn = jest.fn((group: HistoryEventsGroup) => {
      return group.groupType === 'Decision';
    });

    const result = getNavigationBarEventsMenuItems(
      eventGroupsEntries,
      filterFn
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      eventId: '4', // last eventId from completedDecisionTaskEvents
      label: 'Mock decision',
      category: 'DECISION',
    });
  });

  it('should include groups that pass filterFn', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
      ['group2', mockDecisionEventGroup],
    ];

    const result = getNavigationBarEventsMenuItems(
      eventGroupsEntries,
      () => true
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      eventId: '10', // last eventId from completedActivityTaskEvents
      label: 'Mock event',
      category: 'ACTIVITY',
    });
    expect(result[1]).toEqual({
      eventId: '4', // last eventId from completedDecisionTaskEvents
      label: 'Mock decision',
      category: 'DECISION',
    });
  });

  it('should use shortLabel when available, otherwise use label', () => {
    const groupWithShortLabel: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      label: 'Long Label',
      shortLabel: 'Short',
    };
    const groupWithoutShortLabel: HistoryEventsGroup = {
      ...mockDecisionEventGroup,
      label: 'Decision Label',
    };
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', groupWithShortLabel],
      ['group2', groupWithoutShortLabel],
    ];

    const result = getNavigationBarEventsMenuItems(
      eventGroupsEntries,
      () => true
    );

    expect(result).toHaveLength(2);
    expect(result[0].label).toBe('Short');
    expect(result[1].label).toBe('Decision Label');
  });

  it('should use the last event eventId from each group', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];

    const result = getNavigationBarEventsMenuItems(
      eventGroupsEntries,
      () => true
    );

    expect(result).toHaveLength(1);
    // completedActivityTaskEvents has events with ids: '7', '9', '10'
    // Last eventId should be '10'
    expect(result[0].eventId).toBe('10');
  });

  it('should include pending-only groups keyed by computedEventId', () => {
    const pendingOnlyGroup: HistoryEventsGroup = {
      ...mockDecisionEventGroup,
      shortLabel: 'Decision',
      events: [pendingDecisionTaskStartEvent],
    };
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', pendingOnlyGroup],
    ];

    const result = getNavigationBarEventsMenuItems(
      eventGroupsEntries,
      () => true
    );

    expect(result).toEqual([
      {
        eventId: pendingDecisionTaskStartEvent.computedEventId,
        label: 'Decision',
        category: 'DECISION',
      },
    ]);
  });

  it('should target the last persisted event when the group ends with a pending synthetic event', () => {
    const groupEndingWithPending: HistoryEventsGroup = {
      ...mockDecisionEventGroup,
      shortLabel: 'Decision',
      events: [mockDecisionEventGroup.events[0], pendingDecisionTaskStartEvent],
    };
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', groupEndingWithPending],
    ];

    const result = getNavigationBarEventsMenuItems(
      eventGroupsEntries,
      () => true
    );

    expect(result).toEqual([
      {
        eventId: mockDecisionEventGroup.events[0].eventId,
        label: 'Decision',
        category: 'DECISION',
      },
    ]);
  });

  it('should not list an activity group that ends with a pending event', () => {
    const activityGroupEndingWithPending: HistoryEventsGroup = {
      ...mockActivityEventGroup,
      events: [mockActivityEventGroup.events[0], pendingActivityTaskStartEvent],
    };
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', activityGroupEndingWithPending],
    ];

    const result = getNavigationBarEventsMenuItems(
      eventGroupsEntries,
      () => true
    );

    expect(result).toEqual([]);
  });

  it('should list a grouper-produced pending-only decision group by computedEventId', async () => {
    const grouper = new WorkflowHistoryGrouper();
    try {
      await grouper.updatePendingEvents({
        pendingStartActivities: [],
        pendingStartDecision: createPendingDecision('2'),
      });

      const result = getNavigationBarEventsMenuItems(
        Object.entries(grouper.getState().groups),
        () => true
      );

      expect(result).toHaveLength(1);
      expect(result[0].eventId).toBe(
        createPendingDecision('2').computedEventId
      );
      expect(result[0].category).toBe('DECISION');
    } finally {
      grouper.destroy();
    }
  });
});
