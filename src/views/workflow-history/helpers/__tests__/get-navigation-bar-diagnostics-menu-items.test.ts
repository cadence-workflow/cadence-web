import {
  mockActivityEventGroup,
  mockDecisionEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import {
  type EventGroupEntry,
  type WorkflowDiagnosticsIssuesByEventId,
} from '../../workflow-history.types';
import getNavigationBarDiagnosticsMenuItems from '../get-navigation-bar-diagnostics-menu-items';

describe(getNavigationBarDiagnosticsMenuItems.name, () => {
  it('returns an empty array when the diagnostics map is empty', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];

    const result = getNavigationBarDiagnosticsMenuItems(eventGroupsEntries, {});

    expect(result).toEqual([]);
  });

  it('skips groups that have no issues', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
      ['group2', mockDecisionEventGroup],
    ];
    // completedDecisionTaskEvents has event ids '2', '3', '4', none of which are here
    const diagnosticsMap: WorkflowDiagnosticsIssuesByEventId = {
      'not-in-any-group': [
        {
          issueId: 0,
          invariantType: 'Activity Failed',
          reason: 'r',
          metadata: {},
        },
      ],
    };

    const result = getNavigationBarDiagnosticsMenuItems(
      eventGroupsEntries,
      diagnosticsMap
    );

    expect(result).toEqual([]);
  });

  it('uses the first event with issues as the item eventId, keeping label and category', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];
    // completedActivityTaskEvents has event ids '7', '9', '10' in order
    const diagnosticsMap: WorkflowDiagnosticsIssuesByEventId = {
      '9': [
        {
          issueId: 0,
          invariantType: 'Activity Failed',
          reason: 'r',
          metadata: {},
        },
      ],
      '10': [
        {
          issueId: 1,
          invariantType: 'Activity Timeout',
          reason: 'r',
          metadata: {},
        },
      ],
    };

    const result = getNavigationBarDiagnosticsMenuItems(
      eventGroupsEntries,
      diagnosticsMap
    );

    expect(result).toHaveLength(1);
    expect(result[0].eventId).toBe('9');
    expect(result[0].label).toBe(mockActivityEventGroup.label);
    expect(result[0].category).toBe('ACTIVITY');
  });

  it('keeps each issue tied to its own eventId within a group', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
    ];
    const diagnosticsMap: WorkflowDiagnosticsIssuesByEventId = {
      '7': [
        {
          issueId: 0,
          invariantType: 'Activity Failed',
          reason: 'r',
          metadata: {},
        },
      ],
      '10': [
        {
          issueId: 1,
          invariantType: 'Activity Timeout',
          reason: 'r',
          metadata: {},
        },
      ],
    };

    const result = getNavigationBarDiagnosticsMenuItems(
      eventGroupsEntries,
      diagnosticsMap
    );

    expect(result).toHaveLength(1);
    expect(result[0].subItems).toEqual([
      { id: 'Activity Failed.0', eventId: '7', label: 'Activity Failed' },
      { id: 'Activity Timeout.1', eventId: '10', label: 'Activity Timeout' },
    ]);
  });

  it('includes one item per group that has issues', () => {
    const eventGroupsEntries: Array<EventGroupEntry> = [
      ['group1', mockActivityEventGroup],
      ['group2', mockDecisionEventGroup],
    ];
    const diagnosticsMap: WorkflowDiagnosticsIssuesByEventId = {
      '7': [
        {
          issueId: 0,
          invariantType: 'Activity Failed',
          reason: 'r',
          metadata: {},
        },
      ],
      '4': [
        {
          issueId: 1,
          invariantType: 'Decision Failed',
          reason: 'r',
          metadata: {},
        },
      ],
    };

    const result = getNavigationBarDiagnosticsMenuItems(
      eventGroupsEntries,
      diagnosticsMap
    );

    expect(result).toHaveLength(2);
    expect(result[0].eventId).toBe('7');
    expect(result[1].eventId).toBe('4');
  });
});
