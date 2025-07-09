import { type ActivityHistoryGroup } from '../../../workflow-history.types';
import { type WorkflowHistoryFiltersStatusValue } from '../../workflow-history-filters-status.types';
import filterGroupsByGroupStatus from '../filter-groups-by-group-status';

const ACTIVITY_HISTORY_GROUP_COMPLETED: ActivityHistoryGroup = {
  label: 'Mock activity',
  eventsMetadata: [],
  status: 'COMPLETED',
  hasMissingEvents: false,
  timeMs: 123456789,
  startTimeMs: 123456789,
  timeLabel: 'Mock time label',
  groupType: 'Activity',
  events: [],
};

describe(filterGroupsByGroupStatus.name, () => {
  it('should return true if historyEventStatuses is undefined', () => {
    const value: WorkflowHistoryFiltersStatusValue = {
      historyEventStatuses: undefined,
    };

    expect(
      filterGroupsByGroupStatus(ACTIVITY_HISTORY_GROUP_COMPLETED, value)
    ).toBe(true);
  });

  it('should return true if group status is included in historyEventStatuses', () => {
    const value: WorkflowHistoryFiltersStatusValue = {
      historyEventStatuses: ['COMPLETED'],
    };

    expect(
      filterGroupsByGroupStatus(ACTIVITY_HISTORY_GROUP_COMPLETED, value)
    ).toBe(true);
  });

  it('should return false if group status is not included in historyEventStatuses', () => {
    const value: WorkflowHistoryFiltersStatusValue = {
      historyEventStatuses: ['COMPLETED'],
    };

    expect(
      filterGroupsByGroupStatus(
        {
          ...ACTIVITY_HISTORY_GROUP_COMPLETED,
          status: 'FAILED',
        },
        value
      )
    ).toBe(false);
  });

  it('should return true if group status is ONGOING or WAITING when historyEventStatuses includes PENDING', () => {
    const value: WorkflowHistoryFiltersStatusValue = {
      historyEventStatuses: ['PENDING'],
    };

    expect(
      filterGroupsByGroupStatus(
        {
          ...ACTIVITY_HISTORY_GROUP_COMPLETED,
          status: 'ONGOING',
        },
        value
      )
    ).toBe(true);
    expect(
      filterGroupsByGroupStatus(
        {
          ...ACTIVITY_HISTORY_GROUP_COMPLETED,
          status: 'WAITING',
        },
        value
      )
    ).toBe(true);
  });

  it('should return false if group status is not ONGOING or WAITING when historyEventStatuses includes PENDING', () => {
    const value: WorkflowHistoryFiltersStatusValue = {
      historyEventStatuses: ['PENDING'],
    };

    expect(
      filterGroupsByGroupStatus(ACTIVITY_HISTORY_GROUP_COMPLETED, value)
    ).toBe(false);
  });
});
