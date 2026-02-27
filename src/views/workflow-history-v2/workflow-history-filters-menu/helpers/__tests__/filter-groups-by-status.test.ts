import { type ActivityHistoryGroup } from '../../../workflow-history-v2.types';
import { type EventGroupStatusFilterValue } from '../../workflow-history-filters-menu.types';
import filterGroupsByStatus from '../filter-groups-by-status';

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
  firstEventId: null,
};

describe(filterGroupsByStatus.name, () => {
  it('should return true if historyEventStatuses is undefined', () => {
    const value: EventGroupStatusFilterValue = {
      historyEventStatuses: undefined,
    };

    expect(filterGroupsByStatus(ACTIVITY_HISTORY_GROUP_COMPLETED, value)).toBe(
      true
    );
  });

  it('should return true if group status is included in historyEventStatuses', () => {
    const value: EventGroupStatusFilterValue = {
      historyEventStatuses: ['COMPLETED'],
    };

    expect(filterGroupsByStatus(ACTIVITY_HISTORY_GROUP_COMPLETED, value)).toBe(
      true
    );
  });

  it('should return false if group status is not included in historyEventStatuses', () => {
    const value: EventGroupStatusFilterValue = {
      historyEventStatuses: ['COMPLETED'],
    };

    expect(
      filterGroupsByStatus(
        {
          ...ACTIVITY_HISTORY_GROUP_COMPLETED,
          status: 'FAILED',
        },
        value
      )
    ).toBe(false);
  });

  it('should return true if group status is CANCELED when historyEventStatuses includes CANCELED', () => {
    const value: EventGroupStatusFilterValue = {
      historyEventStatuses: ['CANCELED'],
    };

    expect(
      filterGroupsByStatus(
        {
          ...ACTIVITY_HISTORY_GROUP_COMPLETED,
          status: 'CANCELED',
        },
        value
      )
    ).toBe(true);
  });

  it('should return true if group status is ONGOING or WAITING when historyEventStatuses includes PENDING', () => {
    const value: EventGroupStatusFilterValue = {
      historyEventStatuses: ['PENDING'],
    };

    expect(
      filterGroupsByStatus(
        {
          ...ACTIVITY_HISTORY_GROUP_COMPLETED,
          status: 'ONGOING',
        },
        value
      )
    ).toBe(true);
    expect(
      filterGroupsByStatus(
        {
          ...ACTIVITY_HISTORY_GROUP_COMPLETED,
          status: 'WAITING',
        },
        value
      )
    ).toBe(true);
  });

  it('should return false if group status is not ONGOING or WAITING when historyEventStatuses includes PENDING', () => {
    const value: EventGroupStatusFilterValue = {
      historyEventStatuses: ['PENDING'],
    };

    expect(filterGroupsByStatus(ACTIVITY_HISTORY_GROUP_COMPLETED, value)).toBe(
      false
    );
  });
});
