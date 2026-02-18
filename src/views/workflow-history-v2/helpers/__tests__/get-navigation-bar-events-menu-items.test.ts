import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import {
  type HistoryEventsGroup,
  type EventGroupEntry,
} from '../../workflow-history-v2.types';
import getNavigationBarEventsMenuItems from '../get-navigation-bar-events-menu-items';

jest.mock(
  '../../workflow-history-event-group/helpers/get-event-group-filtering-type',
  () =>
    jest.fn((group: HistoryEventsGroup) => {
      if (group.groupType === 'Activity') return 'ACTIVITY';
      if (group.groupType === 'Decision') return 'DECISION';
      return 'WORKFLOW';
    })
);

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
      type: 'DECISION',
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
      type: 'ACTIVITY',
    });
    expect(result[1]).toEqual({
      eventId: '4', // last eventId from completedDecisionTaskEvents
      label: 'Mock decision',
      type: 'DECISION',
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
});
