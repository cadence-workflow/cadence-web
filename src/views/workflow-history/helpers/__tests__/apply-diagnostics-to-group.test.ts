import { completedActivityTaskEvents } from '../../__fixtures__/workflow-history-activity-events';
import { pendingActivityTaskStartEvent } from '../../__fixtures__/workflow-history-pending-events';
import {
  type ActivityHistoryGroup,
  type HistoryGroupEventMetadata,
  type WorkflowDiagnosticsIssue,
  type WorkflowDiagnosticsIssuesByEventId,
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
  it('sets issues on events matched by eventId', () => {
    const group = createGroup();
    const issues = [mockIssue];

    const result = applyDiagnosticsToGroup(group, { '9': issues });

    expect(result.eventsMetadata[1].diagnosticsIssues).toBe(issues);
    expect(result.eventsMetadata[0]).not.toHaveProperty('diagnosticsIssues');
    expect(result.eventsMetadata[2]).not.toHaveProperty('diagnosticsIssues');
  });

  it('sets issues on pending events matched by computedEventId', () => {
    const group = createGroup({
      events: [...completedActivityTaskEvents, pendingActivityTaskStartEvent],
    });
    const issues = [mockIssue];

    const result = applyDiagnosticsToGroup(group, {
      [pendingActivityTaskStartEvent.computedEventId]: issues,
    });

    expect(result.eventsMetadata[3].diagnosticsIssues).toBe(issues);
  });

  it('removes stale issues without leaving the key behind', () => {
    const group = createGroup({ withIssuesOnIndex: 1 });

    const result = applyDiagnosticsToGroup(group, {});

    expect(result.eventsMetadata[1]).not.toHaveProperty('diagnosticsIssues');
  });

  it('removes issues when the list for the event is empty', () => {
    const group = createGroup({ withIssuesOnIndex: 1 });

    const result = applyDiagnosticsToGroup(group, { '9': [] });

    expect(result.eventsMetadata[1]).not.toHaveProperty('diagnosticsIssues');
  });

  it('returns the same group when nothing changes', () => {
    const group = createGroup();

    expect(applyDiagnosticsToGroup(group, {})).toBe(group);
  });

  it('returns the same group when the same issues list is applied again', () => {
    const issues = [mockIssue];
    const map: WorkflowDiagnosticsIssuesByEventId = { '9': issues };
    const first = applyDiagnosticsToGroup(createGroup(), map);

    expect(applyDiagnosticsToGroup(first, map)).toBe(first);
  });

  it('does not mutate the input group', () => {
    const group = createGroup();
    const originalMetadata = group.eventsMetadata;
    const snapshot = structuredClone(group.eventsMetadata);

    const result = applyDiagnosticsToGroup(group, { '9': [mockIssue] });

    expect(result).not.toBe(group);
    expect(group.eventsMetadata).toBe(originalMetadata);
    expect(group.eventsMetadata).toEqual(snapshot);
  });

  it('keeps identity of metadata entries that did not change', () => {
    const group = createGroup();

    const result = applyDiagnosticsToGroup(group, { '9': [mockIssue] });

    expect(result.eventsMetadata[0]).toBe(group.eventsMetadata[0]);
    expect(result.eventsMetadata[1]).not.toBe(group.eventsMetadata[1]);
    expect(result.eventsMetadata[2]).toBe(group.eventsMetadata[2]);
  });
});

function createGroup({
  events = completedActivityTaskEvents,
  withIssuesOnIndex,
}: {
  events?: ActivityHistoryGroup['events'];
  withIssuesOnIndex?: number;
} = {}): ActivityHistoryGroup {
  const eventsMetadata: Array<HistoryGroupEventMetadata> = events.map(
    (_, index) => ({
      label: `Event ${index}`,
      status: 'COMPLETED',
      timeMs: 1725747370632,
      timeLabel: 'Mock time label',
      ...(index === withIssuesOnIndex && { diagnosticsIssues: [mockIssue] }),
    })
  );

  return {
    label: 'Mock event',
    groupType: 'Activity',
    status: 'COMPLETED',
    eventsMetadata,
    hasMissingEvents: false,
    timeMs: 1725747370632,
    startTimeMs: 1725747370599,
    timeLabel: 'Mock time label',
    events,
    firstEventId: events[0].eventId,
  };
}
