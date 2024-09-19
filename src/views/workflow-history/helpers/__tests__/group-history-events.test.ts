import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import logger from '@/utils/logger';

import {
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
} from '../../__fixtures__/workflow-history-activity-events';
import { startDecisionTaskEvent } from '../../__fixtures__/workflow-history-decision-events';
import type { ActivityHistoryEvent } from '../../workflow-history.types';
import getHistoryEventGroupId from '../get-history-event-group-id';
import { groupHistoryEvents } from '../group-history-events';

jest.mock('../get-history-event-group-id', () => jest.fn());
jest.mock('../place-event-in-group-events', () =>
  jest.fn().mockImplementation((event, events) => [...events, event])
);

const mockedGetHistoryEventGroupId =
  getHistoryEventGroupId as jest.MockedFunction<typeof getHistoryEventGroupId>;

describe('groupHistoryEvents', () => {
  let mockLoggerWarn: jest.SpyInstance;

  beforeEach(() => {
    mockLoggerWarn = jest.spyOn(logger, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial groups if no events are passed', () => {
    const result = groupHistoryEvents([]);
    expect(result).toEqual({});
  });

  it('should warn if groupId cannot be extracted from an event', () => {
    const events: HistoryEvent[] = [scheduleActivityTaskEvent];
    mockedGetHistoryEventGroupId.mockReturnValue(undefined);
    groupHistoryEvents(events);
    expect(mockLoggerWarn).toHaveBeenCalledWith(
      {
        eventId: scheduleActivityTaskEvent.eventId,
        eventTime: scheduleActivityTaskEvent.eventTime,
      },
      "Couldn't extract groupId from event, check event payload and extraction logic"
    );
  });

  it('should warn if events are grouped together while they are not the same group type', () => {
    const events: HistoryEvent[] = [
      scheduleActivityTaskEvent,
      startDecisionTaskEvent,
    ];
    mockedGetHistoryEventGroupId.mockReturnValue('group1');

    groupHistoryEvents(events);
    expect(mockLoggerWarn).toHaveBeenCalledWith(
      {
        eventId: startDecisionTaskEvent.eventId,
        eventTime: startDecisionTaskEvent.eventTime,
        events: events.map(({ eventId, eventTime }) => ({
          eventId,
          eventTime,
        })),
      },
      'No handler for grouping this event'
    );
  });

  it('should group events as activity group when all events are of the same group', () => {
    const events: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
    ];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group1');

    const result = groupHistoryEvents(events);
    expect(result.group1.events).toEqual(events);
  });

  it('should warn when no event handler matches the event type', () => {
    const events: HistoryEvent[] = [
      {
        ...scheduleActivityTaskEvent,
        //@ts-expect-error Type '"fakeAttribute"' is not assignable to type
        attributes: 'fakeAttribute',
      },
    ];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group3');

    const result = groupHistoryEvents(events);

    expect(mockLoggerWarn).toHaveBeenCalledWith(
      {
        eventId: scheduleActivityTaskEvent.eventId,
        eventTime: scheduleActivityTaskEvent.eventTime,
        events: [
          {
            eventId: scheduleActivityTaskEvent.eventId,
            eventTime: scheduleActivityTaskEvent.eventTime,
          },
        ],
      },
      'No handler for grouping this event'
    );
    expect(result).toEqual({});
  });
});
