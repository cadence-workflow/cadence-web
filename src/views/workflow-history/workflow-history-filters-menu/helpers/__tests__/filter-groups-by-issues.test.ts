import { scheduleActivityTaskEvent } from '../../../__fixtures__/workflow-history-activity-events';
import {
  type ActivityHistoryGroup,
  type WorkflowDiagnosticsIssuesByEventId,
  type WorkflowHistoryPageContextType,
} from '../../../workflow-history.types';
import { type EventGroupIssuesFilterValue } from '../../workflow-history-filters-menu.types';
import filterGroupsByIssues from '../filter-groups-by-issues';

const ACTIVITY_HISTORY_GROUP: ActivityHistoryGroup = {
  label: 'Mock activity',
  eventsMetadata: [],
  status: 'COMPLETED',
  hasMissingEvents: false,
  timeMs: 123456789,
  startTimeMs: 123456789,
  timeLabel: 'Mock time label',
  groupType: 'Activity',
  events: [scheduleActivityTaskEvent],
  firstEventId: null,
};

function buildContext(
  diagnosticsByEventId: WorkflowDiagnosticsIssuesByEventId
): WorkflowHistoryPageContextType {
  return {
    pageConfig: { WORKFLOW_DIAGNOSTICS_IN_HISTORY_ENABLED: true },
    diagnosticsByEventId,
  };
}

const DIAGNOSTICS_WITH_GROUP_ISSUE = buildContext({
  '7': [
    {
      issueId: 0,
      invariantType: 'Activity Failed',
      reason: 'Activity failed on event 7',
      metadata: {},
    },
  ],
});

describe(filterGroupsByIssues.name, () => {
  it('should return true if historyEventIssues is false', () => {
    const value: EventGroupIssuesFilterValue = {
      historyEventIssues: false,
    };

    expect(
      filterGroupsByIssues(ACTIVITY_HISTORY_GROUP, value, buildContext({}))
    ).toBe(true);
  });

  it('should return true if historyEventIssues is set and group has scoped issues', () => {
    const value: EventGroupIssuesFilterValue = {
      historyEventIssues: true,
    };

    expect(
      filterGroupsByIssues(
        ACTIVITY_HISTORY_GROUP,
        value,
        DIAGNOSTICS_WITH_GROUP_ISSUE
      )
    ).toBe(true);
  });

  it('should return false if historyEventIssues is set and group has no scoped issues', () => {
    const value: EventGroupIssuesFilterValue = {
      historyEventIssues: true,
    };

    expect(
      filterGroupsByIssues(
        ACTIVITY_HISTORY_GROUP,
        value,
        buildContext({
          '99': [
            {
              issueId: 1,
              invariantType: 'Activity Timeout',
              reason: 'Unrelated event',
              metadata: {},
            },
          ],
        })
      )
    ).toBe(false);
  });

  it('should return false if historyEventIssues is set and diagnostics map is empty', () => {
    const value: EventGroupIssuesFilterValue = {
      historyEventIssues: true,
    };

    expect(
      filterGroupsByIssues(ACTIVITY_HISTORY_GROUP, value, buildContext({}))
    ).toBe(false);
  });
});
