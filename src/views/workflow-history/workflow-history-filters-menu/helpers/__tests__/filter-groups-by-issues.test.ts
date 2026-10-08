import { scheduleActivityTaskEvent } from '../../../__fixtures__/workflow-history-activity-events';
import {
  type ActivityHistoryGroup,
  type HistoryGroupEventMetadata,
  type WorkflowDiagnosticsIssue,
} from '../../../workflow-history.types';
import { type EventGroupIssuesFilterValue } from '../../workflow-history-filters-menu.types';
import filterGroupsByIssues from '../filter-groups-by-issues';

const BASE_METADATA: HistoryGroupEventMetadata = {
  label: 'Scheduled',
  status: 'COMPLETED',
  timeMs: 123456789,
  timeLabel: 'Mock time label',
};

const DIAGNOSTICS_ISSUE: WorkflowDiagnosticsIssue = {
  issueId: 0,
  invariantType: 'Activity Failed',
  reason: 'Activity failed on event 7',
  metadata: {},
  rootCauses: [],
};

describe(filterGroupsByIssues.name, () => {
  it('should return true if historyEventIssues is false', () => {
    expect(
      filterGroupsByIssues(buildGroup([BASE_METADATA]), {
        historyEventIssues: false,
      })
    ).toBe(true);
  });

  it('should return true if historyEventIssues is set and an event has issues', () => {
    expect(
      filterGroupsByIssues(
        buildGroup([BASE_METADATA, BASE_METADATA], [DIAGNOSTICS_ISSUE]),
        ISSUES_ONLY
      )
    ).toBe(true);
  });

  it('should return false if historyEventIssues is set and no event has issues', () => {
    expect(filterGroupsByIssues(buildGroup([BASE_METADATA]), ISSUES_ONLY)).toBe(
      false
    );
  });

  it('should return false if historyEventIssues is set and issues are empty', () => {
    expect(
      filterGroupsByIssues(buildGroup([BASE_METADATA], []), ISSUES_ONLY)
    ).toBe(false);
  });

  it('should return false if historyEventIssues is set and group has no events metadata', () => {
    expect(filterGroupsByIssues(buildGroup([]), ISSUES_ONLY)).toBe(false);
  });
});

const ISSUES_ONLY: EventGroupIssuesFilterValue = { historyEventIssues: true };

function buildGroup(
  eventsMetadata: Array<HistoryGroupEventMetadata>,
  diagnosticsIssues?: Array<WorkflowDiagnosticsIssue>
): ActivityHistoryGroup {
  return {
    label: 'Mock activity',
    eventsMetadata,
    status: 'COMPLETED',
    hasMissingEvents: false,
    timeMs: 123456789,
    startTimeMs: 123456789,
    timeLabel: 'Mock time label',
    groupType: 'Activity',
    events: [scheduleActivityTaskEvent],
    firstEventId: null,
    ...(diagnosticsIssues && { diagnosticsIssues }),
  };
}
