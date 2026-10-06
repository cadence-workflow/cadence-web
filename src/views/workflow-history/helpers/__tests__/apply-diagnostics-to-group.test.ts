import { completedActivityTaskEvents } from '../../__fixtures__/workflow-history-activity-events';
import { pendingActivityTaskStartEvent } from '../../__fixtures__/workflow-history-pending-events';
import {
  type ActivityHistoryGroup,
  type HistoryGroupEventMetadata,
  type WorkflowDiagnosticsIssue,
} from '../../workflow-history.types';
import applyDiagnosticsToGroup from '../apply-diagnostics-to-group';

const mockIssue: WorkflowDiagnosticsIssue = {
  issueId: 0,
  invariantType: 'Activity Failed',
  reason: 'r',
  metadata: {},
  rootCauses: [],
};

describe(applyDiagnosticsToGroup.name, () => {
  it('collects issues across multiple events in event order', () => {
    const group = createGroup();
    const issueA = { ...mockIssue, issueId: 1 };
    const issueB = { ...mockIssue, issueId: 2 };
    const issueC = { ...mockIssue, issueId: 3 };

    const result = applyDiagnosticsToGroup(group, {
      '9': [issueB, issueC],
      [String(completedActivityTaskEvents[0].eventId)]: [issueA],
    });

    expect(result.diagnosticsIssues).toEqual([issueA, issueB, issueC]);
  });

  it('sets issues on pending events matched by computedEventId', () => {
    const group = createGroup({
      events: [...completedActivityTaskEvents, pendingActivityTaskStartEvent],
    });
    const issues = [mockIssue];

    const result = applyDiagnosticsToGroup(group, {
      [pendingActivityTaskStartEvent.computedEventId]: issues,
    });

    expect(result.diagnosticsIssues).toEqual(issues);
  });

  it('removes stale issues without leaving the key behind', () => {
    const group = createGroup({ withIssues: true });

    const result = applyDiagnosticsToGroup(group, {});

    expect(result).not.toHaveProperty('diagnosticsIssues');
  });

  it('removes issues when the list for the event is empty', () => {
    const group = createGroup({ withIssues: true });

    const result = applyDiagnosticsToGroup(group, { '9': [] });

    expect(result).not.toHaveProperty('diagnosticsIssues');
  });

  it('returns the same group when nothing changes', () => {
    const group = createGroup();

    expect(applyDiagnosticsToGroup(group, {})).toBe(group);
  });

  it('returns the same group when equal issues are applied again', () => {
    const issues = [mockIssue];
    const first = applyDiagnosticsToGroup(createGroup(), { '9': issues });

    expect(applyDiagnosticsToGroup(first, { '9': [...issues] })).toBe(first);
  });

  it('does not mutate the input group', () => {
    const group = createGroup();
    const snapshot = structuredClone(group);

    const result = applyDiagnosticsToGroup(group, { '9': [mockIssue] });

    expect(result).not.toBe(group);
    expect(group).toEqual(snapshot);
    expect(group).not.toHaveProperty('diagnosticsIssues');
  });
});

function createGroup({
  events = completedActivityTaskEvents,
  withIssues,
}: {
  events?: ActivityHistoryGroup['events'];
  withIssues?: boolean;
} = {}): ActivityHistoryGroup {
  const eventsMetadata: Array<HistoryGroupEventMetadata> = events.map(
    (_, index) => ({
      label: `Event ${index}`,
      status: 'COMPLETED',
      timeMs: 1725747370632,
      timeLabel: 'Mock time label',
    })
  );

  return {
    label: 'Mock event',
    groupType: 'Activity',
    status: 'COMPLETED',
    eventsMetadata,
    ...(withIssues && { diagnosticsIssues: [mockIssue] }),
    hasMissingEvents: false,
    timeMs: 1725747370632,
    startTimeMs: 1725747370599,
    timeLabel: 'Mock time label',
    events,
    firstEventId: events[0].eventId,
  };
}
