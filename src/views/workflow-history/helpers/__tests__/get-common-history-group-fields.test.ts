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

jest.useFakeTimers().setSystemTime(new Date('2024-05-25'));

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
      'Started at 07 Sep, 22:32:50 UTC',
      'Fired at 07 Sep, 22:34:30 UTC',
    ]);
  });

  it('should override group eventsMetadata timeLabel when eventToTimeLabelPrefixMap is passed', () => {
    const group = setup({
      eventToTimeLabelPrefixMap: {
        timerStartedEventAttributes: 'Happend at',
      },
    });
    expect(group.eventsMetadata.map(({ timeLabel }) => timeLabel)).toEqual([
      'Happend at 07 Sep, 22:32:50 UTC',
      'Fired at 07 Sep, 22:34:30 UTC',
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

  it('should return group with closeTimeMs equal to closeEvent timeMs', () => {
    const group = setup({
      closeEvent: fireTimerTaskEvent,
    });
    expect(group.closeTimeMs).toEqual(1725748470005.1672);
  });

  it('should return group with closeTimeMs equal to null if no closeEvent is passed', () => {
    const group = setup({});
    expect(group.closeTimeMs).toEqual(null);
  });

  it('should return group with startTimeMs equal to first event timeMs', () => {
    const group = setup({});
    expect(group.startTimeMs).toEqual(group.eventsMetadata[0].timeMs);
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

  it('should include negativeFields when eventStatusToNegativeFieldsMap is provided', () => {
    const eventStatusToNegativeFieldsMap = {
      timerStartedEventAttributes: ['startReason', 'startDetails'],
      timerFiredEventAttributes: ['fireReason', 'fireDetails'],
    };

    const group = setup({
      eventStatusToNegativeFieldsMap,
    });

    expect(group.eventsMetadata[0].negativeFields).toEqual([
      'startReason',
      'startDetails',
    ]);
    expect(group.eventsMetadata[1].negativeFields).toEqual([
      'fireReason',
      'fireDetails',
    ]);
  });

  it('should not include negativeFields when eventStatusToNegativeFieldsMap is not provided', () => {
    const group = setup({});

    group.eventsMetadata.forEach((metadata) => {
      expect(metadata.negativeFields).toBeUndefined();
    });
  });

  it('should not include negativeFields when eventStatusToNegativeFieldsMap is empty', () => {
    const group = setup({
      eventStatusToNegativeFieldsMap: {},
    });

    group.eventsMetadata.forEach((metadata) => {
      expect(metadata.negativeFields).toBeUndefined();
    });
  });

  it('should only include negativeFields for events that have mappings', () => {
    const eventStatusToNegativeFieldsMap = {
      timerStartedEventAttributes: ['startReason'],
    };

    const group = setup({
      eventStatusToNegativeFieldsMap,
    });

    expect(group.eventsMetadata[0].negativeFields).toEqual(['startReason']);
    expect(group.eventsMetadata[1].negativeFields).toBeUndefined();
  });

  it('should return group with firstEventId equal to first event id', () => {
    const group = setup({});
    expect(group.firstEventId).toEqual(group.events[0].eventId);
  });
});

// using timer events for testing
function setup({
  events,
  eventToTimeLabelPrefixMap = {},
  eventToLabel,
  eventToStatus,
  closeEvent,
  eventStatusToNegativeFieldsMap,
}: {
  events?: TimerHistoryEvent[];
  eventToStatus?: HistoryGroupEventToStatusMap<TimerHistoryGroup>;
  eventToLabel?: HistoryGroupEventToStringMap<TimerHistoryGroup>;
  eventToTimeLabelPrefixMap?: Partial<
    HistoryGroupEventToStringMap<TimerHistoryGroup>
  >;
  closeEvent?: TimerHistoryEvent;
  eventStatusToNegativeFieldsMap?: any;
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
    eventToTimeLabelPrefixMap,
    closeEvent,
    eventStatusToNegativeFieldsMap
  );
}
