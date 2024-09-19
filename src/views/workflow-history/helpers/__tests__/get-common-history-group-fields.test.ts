import {
  fireTimerTaskEvent,
  startTimerTaskEvent,
} from '../../__fixtures__/workflow-history-timer-events';
import type {
  HistoryGroupEventMetadata,
  HistoryGroupEventToStatusMap,
  HistoryGroupEventToStringMap,
  TimerHistoryEvent,
  TimerHistoryGroup,
} from '../../workflow-history.types';
import getCommonHistoryGroupFields from '../get-common-history-group-fields';

describe('getCommonHistoryGroupFields', () => {
  it('should return group eventsMetadata with correct labels', () => {
    const group = setup({});
    expect(group.eventsMetadata.map(({ label }) => label)).toEqual([
      'Started',
      'Fired',
    ]);
  });

  it('should return group eventsMetadata with correct status', () => {
    const group = setup({});
    expect(group.eventsMetadata.map(({ status }) => status)).toEqual([
      'COMPLETED',
      'COMPLETED',
    ]);
  });

  it('should return group eventsMetadata with correct timeMs', () => {
    const group = setup({});
    expect(group.eventsMetadata.map(({ timeMs }) => timeMs)).toEqual([
      1725748370632.0728, 1725748470005.1672,
    ]);
  });

  it('should return group eventsMetadata with correct timeLabel', () => {
    const group = setup({});
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Started at 07 Sep, 22:32:50 GMT+0',
      'Fired at 07 Sep, 22:34:30 GMT+0',
    ]);
  });

  it('should override group eventsMetadata timeLabel when eventToTimeLabelPrefixMap is passed', () => {
    const group = setup({
      eventToTimeLabelPrefixMap: {
        timerStartedEventAttributes: 'Happend at',
      },
    });
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Happend at 07 Sep, 22:32:50 GMT+0',
      'Fired at 07 Sep, 22:34:30 GMT+0',
    ]);
  });

  it('should return the result of the function call if a function is passed for a stastus key', () => {
    const singleEvent = [startTimerTaskEvent];
    const mockedGetStatusFunc = jest.fn().mockReturnValue('ONGOING');
    const eventToStatus: HistoryGroupEventToStatusMap<TimerHistoryGroup> = {
      timerStartedEventAttributes: mockedGetStatusFunc,
      timerFiredEventAttributes: 'COMPLETED',
      timerCanceledEventAttributes: 'CANCELED',
    };
    const group = setup({
      events: singleEvent,
      eventToStatus,
    });
    expect(group.eventsMetadata.map(({ status }) => status)).toEqual([
      'ONGOING',
    ]);

    expect(mockedGetStatusFunc).toHaveBeenCalledWith(
      startTimerTaskEvent,
      singleEvent,
      0
    );
  });

  const groupFieldsExtractedFromEventsMetadaTests: {
    name: string;
    groupField: 'events' | 'eventsMetadata' | 'status' | 'timeMs' | 'timeLabel';
    eventsMetadataField: keyof HistoryGroupEventMetadata;
  }[] = [
    {
      name: 'should return group with status equal to last event status',
      groupField: 'status',
      eventsMetadataField: 'status',
    },
    {
      name: 'should return group with timeMs equal to last event timeMs',
      groupField: 'timeMs',
      eventsMetadataField: 'timeMs',
    },
    {
      name: 'should return group with timeMs equal to last event timeLabel',
      groupField: 'timeLabel',
      eventsMetadataField: 'timeLabel',
    },
  ];

  groupFieldsExtractedFromEventsMetadaTests.map(
    ({ name, groupField, eventsMetadataField }) => {
      it(name, () => {
        const group = setup({});
        const groupLastIndex = group.eventsMetadata.length - 1;
        expect(group[groupField]).toBe(
          group.eventsMetadata[groupLastIndex][eventsMetadataField]
        );
      });
    }
  );
});

// using timer events for testing
function setup({
  events,
  eventToTimeLabelPrefixMap = {},
  eventToLabel,
  eventToStatus,
}: {
  events?: TimerHistoryEvent[];
  eventToStatus?: HistoryGroupEventToStatusMap<TimerHistoryGroup>;
  eventToLabel?: HistoryGroupEventToStringMap<TimerHistoryGroup>;
  eventToTimeLabelPrefixMap?: Partial<
    HistoryGroupEventToStringMap<TimerHistoryGroup>
  >;
}) {
  const mockEvents: TimerHistoryEvent[] = events || [
    startTimerTaskEvent,
    fireTimerTaskEvent,
  ];

  const mockedEventToStatus = eventToStatus || {
    timerStartedEventAttributes: 'COMPLETED',
    timerFiredEventAttributes: 'COMPLETED',
    timerCanceledEventAttributes: 'CANCELED',
  };

  const mockedEventToLabel = eventToLabel || {
    timerStartedEventAttributes: 'Started',
    timerFiredEventAttributes: 'Fired',
    timerCanceledEventAttributes: 'Canceled',
  };

  return getCommonHistoryGroupFields(
    mockEvents,
    mockedEventToStatus,
    mockedEventToLabel,
    eventToTimeLabelPrefixMap
  );
}
