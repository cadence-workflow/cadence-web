import {
  completeActivityTaskEvent,
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
} from '../../__fixtures__/workflow-history-activity-events';
import { pendingActivityTaskStartEvent } from '../../__fixtures__/workflow-history-pending-events';
import { type WorkflowDiagnosticsIssuesByEventId } from '../../workflow-history.types';
import scopeDiagnosticsToGroup from '../scope-diagnostics-to-group';

const mockIssuesByEventId: WorkflowDiagnosticsIssuesByEventId = {
  '7': [
    {
      issueId: 0,
      invariantType: 'Activity Failed',
      reason: 'Activity failed on event 7',
      metadata: {},
    },
  ],
  '10': [
    {
      issueId: 1,
      invariantType: 'Activity Timeout',
      reason: 'Activity timed out on event 10',
      metadata: {},
    },
    {
      issueId: 2,
      invariantType: 'Retry Policy',
      reason: 'Retry policy issue on event 10',
      metadata: {},
    },
  ],
  '43': [
    {
      issueId: 3,
      invariantType: 'Activity Failed',
      reason: 'Activity failed on event 43',
      metadata: {},
    },
  ],
  'pending-7': [
    {
      issueId: 4,
      invariantType: 'Activity Pending',
      reason: 'Activity is still pending',
      metadata: {},
    },
  ],
};

describe(scopeDiagnosticsToGroup.name, () => {
  it('returns only the issues for event IDs present in the group', () => {
    const result = scopeDiagnosticsToGroup(
      [
        scheduleActivityTaskEvent,
        startActivityTaskEvent,
        completeActivityTaskEvent,
      ],
      mockIssuesByEventId
    );

    expect(Object.keys(result).sort()).toEqual(['10', '7']);
    expect(result['7']).toEqual(mockIssuesByEventId['7']);
    expect(result['10']).toEqual(mockIssuesByEventId['10']);
  });

  it('uses computedEventId for pending events without an eventId', () => {
    const result = scopeDiagnosticsToGroup(
      [scheduleActivityTaskEvent, pendingActivityTaskStartEvent],
      mockIssuesByEventId
    );

    expect(Object.keys(result).sort()).toEqual(['7', 'pending-7']);
    expect(result['pending-7']).toEqual(mockIssuesByEventId['pending-7']);
  });

  it('returns an empty object when no event in the group has issues', () => {
    const result = scopeDiagnosticsToGroup(
      [startActivityTaskEvent],
      mockIssuesByEventId
    );

    expect(result).toEqual({});
  });

  it('returns an empty object when the group has no events', () => {
    const result = scopeDiagnosticsToGroup([], mockIssuesByEventId);

    expect(result).toEqual({});
  });

  it('returns an empty object when there are no issues', () => {
    const result = scopeDiagnosticsToGroup(
      [scheduleActivityTaskEvent, completeActivityTaskEvent],
      {}
    );

    expect(result).toEqual({});
  });
});
