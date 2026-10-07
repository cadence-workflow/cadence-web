import { completedActivityTaskEvents } from '../../__fixtures__/workflow-history-activity-events';
import {
  type ActivityHistoryGroup,
  type HistoryEventsGroupsMap,
  type WorkflowDiagnosticsIssue,
} from '../../workflow-history.types';
import addDiagnosticsToGroups from '../add-diagnostics-to-groups';

const mockIssue: WorkflowDiagnosticsIssue = {
  issueId: 0,
  invariantType: 'Activity Failed',
  reason: 'r',
  metadata: {},
  rootCauses: [],
};

describe(addDiagnosticsToGroups.name, () => {
  it('returns the same map object when the diagnostics map is empty', () => {
    const groups = createGroups();

    expect(addDiagnosticsToGroups(groups, {})).toBe(groups);
  });

  it('adds issues only to the matching groups', () => {
    const groups = createGroups();
    const matchingEventId = String(completedActivityTaskEvents[0].eventId);

    const result = addDiagnosticsToGroups(groups, {
      [matchingEventId]: [mockIssue],
    });

    expect(result['group-1'].diagnosticsIssues).toEqual([mockIssue]);
    expect(result['group-2']).not.toHaveProperty('diagnosticsIssues');
  });

  it('keeps the same object for groups without issues', () => {
    const groups = createGroups();
    const matchingEventId = String(completedActivityTaskEvents[0].eventId);

    const result = addDiagnosticsToGroups(groups, {
      [matchingEventId]: [mockIssue],
    });

    expect(result['group-1']).not.toBe(groups['group-1']);
    expect(result['group-2']).toBe(groups['group-2']);
  });
});

function createGroups(): HistoryEventsGroupsMap {
  const base: ActivityHistoryGroup = {
    label: 'Mock event',
    groupType: 'Activity',
    status: 'COMPLETED',
    eventsMetadata: completedActivityTaskEvents.map((_, index) => ({
      label: `Event ${index}`,
      status: 'COMPLETED',
      timeMs: 1725747370632,
      timeLabel: 'Mock time label',
    })),
    hasMissingEvents: false,
    timeMs: 1725747370632,
    startTimeMs: 1725747370599,
    timeLabel: 'Mock time label',
    events: completedActivityTaskEvents,
    firstEventId: completedActivityTaskEvents[0].eventId,
  };

  return {
    'group-1': base,
    'group-2': { ...base, events: [], eventsMetadata: [], firstEventId: '100' },
  };
}
