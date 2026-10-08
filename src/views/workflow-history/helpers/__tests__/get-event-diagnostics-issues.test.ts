import { WORKFLOW_DIAGNOSTICS_EVENT_ID_KEY } from '../../workflow-history.constants';
import {
  type HistoryEventsGroup,
  type WorkflowDiagnosticsIssue,
} from '../../workflow-history.types';
import getEventDiagnosticsIssues from '../get-event-diagnostics-issues';

describe(getEventDiagnosticsIssues.name, () => {
  it('returns only the issues whose canonical event id matches', () => {
    const issueForEvent5 = createIssue(1, 5);
    const issueForEvent7 = createIssue(2, 7);
    const secondIssueForEvent5 = createIssue(3, 5);
    const group = createGroup([
      issueForEvent5,
      issueForEvent7,
      secondIssueForEvent5,
    ]);

    expect(getEventDiagnosticsIssues(group, '5')).toEqual([
      issueForEvent5,
      secondIssueForEvent5,
    ]);
    expect(getEventDiagnosticsIssues(group, '7')).toEqual([issueForEvent7]);
  });

  it('returns an empty array when the group has no issues', () => {
    expect(getEventDiagnosticsIssues(createGroup(undefined), '5')).toEqual([]);
  });

  it('returns an empty array for an event with no issues', () => {
    const group = createGroup([createIssue(1, 5)]);

    expect(getEventDiagnosticsIssues(group, '6')).toEqual([]);
  });
});

function createIssue(
  issueId: number,
  eventId: number
): WorkflowDiagnosticsIssue {
  return {
    issueId,
    invariantType: 'Activity Failed',
    reason: 'reason',
    metadata: { [WORKFLOW_DIAGNOSTICS_EVENT_ID_KEY]: eventId },
    rootCauses: [],
  };
}

function createGroup(
  diagnosticsIssues: Array<WorkflowDiagnosticsIssue> | undefined
): HistoryEventsGroup {
  return {
    label: 'Mock activity',
    groupType: 'Activity',
    status: 'COMPLETED',
    eventsMetadata: [],
    hasMissingEvents: false,
    timeMs: 1,
    startTimeMs: 1,
    timeLabel: 'Mock time label',
    events: [],
    firstEventId: null,
    ...(diagnosticsIssues && { diagnosticsIssues }),
  };
}
