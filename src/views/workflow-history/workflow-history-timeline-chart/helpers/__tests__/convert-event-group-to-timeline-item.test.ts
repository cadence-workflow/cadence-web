import {
  mockActivityEventGroup,
  mockTimerEventGroup,
} from '@/views/workflow-history/__fixtures__/workflow-history-event-groups';

import convertEventGroupToTimelineChartItem from '../convert-event-group-to-timeline-item';

jest.mock('../get-class-name-for-event-group', () =>
  jest.fn(() => 'mock-class-name')
);

jest.useFakeTimers().setSystemTime(new Date('2024-09-10'));

describe(convertEventGroupToTimelineChartItem.name, () => {
  it('converts an event group to timeline chart item correctly', () => {
    expect(
      convertEventGroupToTimelineChartItem(mockActivityEventGroup, {} as any)
    ).toEqual({
      className: 'mock-class-name',
      content: 'Mock event',
      end: new Date('2024-09-07T22:16:20.000Z'),
      start: new Date('2024-09-07T22:16:10.599Z'),
      title: 'Mock event: Mock time label',
      type: 'range',
    });
  });

  it('returns end time as present when the event is ongoing or waiting', () => {
    expect(
      convertEventGroupToTimelineChartItem(
        { ...mockActivityEventGroup, timeMs: null, status: 'ONGOING' },
        {} as any
      )
    ).toEqual({
      className: 'mock-class-name',
      content: 'Mock event',
      end: new Date('2024-09-10T00:00:00.000Z'),
      start: new Date('2024-09-07T22:16:10.599Z'),
      title: 'Mock event: Mock time label',
      type: 'range',
    });
  });

  it('returns end time as timer end time when the event is an ongoing timer', () => {
    expect(
      convertEventGroupToTimelineChartItem(
        {
          ...mockTimerEventGroup,
          timeMs: null,
          status: 'ONGOING',
        },
        {} as any
      )
    ).toEqual({
      className: 'mock-class-name',
      content: 'Mock event',
      end: new Date('2024-09-07T22:32:55.632Z'),
      start: new Date('2024-09-07T22:32:50.632Z'),
      title: 'Mock event: Mock time label',
      type: 'range',
    });
  });
});
