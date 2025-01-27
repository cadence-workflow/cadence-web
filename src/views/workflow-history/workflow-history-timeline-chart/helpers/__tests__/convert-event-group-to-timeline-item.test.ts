import { completedActivityTaskEvents } from '@/views/workflow-history/__fixtures__/workflow-history-activity-events';
import { startTimerTaskEvent } from '@/views/workflow-history/__fixtures__/workflow-history-timer-events';
import { type ActivityHistoryGroup } from '@/views/workflow-history/workflow-history.types';

import convertEventGroupToTimelineChartItem from '../convert-event-group-to-timeline-item';

jest.mock('../get-class-name-for-event-group', () =>
  jest.fn(() => 'mock-class-name')
);

const MOCK_HISTORY_EVENT_GROUP: ActivityHistoryGroup = {
  label: 'Mock event',
  groupType: 'Activity',
  status: 'COMPLETED',
  eventsMetadata: [],
  hasMissingEvents: false,
  timeMs: 1725747370000,
  timeLabel: 'Mock time label',
  events: completedActivityTaskEvents,
};

jest.useFakeTimers().setSystemTime(new Date('2024-09-10'));

describe(convertEventGroupToTimelineChartItem.name, () => {
  it('converts an event group to timeline chart item correctly', () => {
    expect(
      convertEventGroupToTimelineChartItem(MOCK_HISTORY_EVENT_GROUP, {} as any)
    ).toEqual({});
  });

  it('returns end time as present when the event is ongoing or waiting', () => {
    expect(
      convertEventGroupToTimelineChartItem(
        { ...MOCK_HISTORY_EVENT_GROUP, timeMs: null, status: 'ONGOING' },
        {} as any
      )
    ).toEqual({});
  });

  it('returns end time as timer end time when the event is an ongoing timer', () => {
    expect(
      convertEventGroupToTimelineChartItem(
        {
          ...MOCK_HISTORY_EVENT_GROUP,
          timeMs: null,
          status: 'ONGOING',
          groupType: 'Timer',
          events: [startTimerTaskEvent],
        },
        {} as any
      )
    ).toEqual({});
  });
});
