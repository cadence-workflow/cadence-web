import type { HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import logger from '@/utils/logger';

import {
  scheduleActivityTaskEvent,
  startActivityTaskEvent,
} from '../../__fixtures__/workflow-history-activity-events';
import {
  scheduleDecisionTaskEvent,
  startDecisionTaskEvent,
} from '../../__fixtures__/workflow-history-decision-events';
import {
  pendingActivityTaskStartEvent,
  pendingActivityTaskStartEventWithStartedState,
  pendingDecisionTaskStartEvent,
  pendingDecisionTaskStartEventWithStartedState,
} from '../../__fixtures__/workflow-history-pending-events';
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
    const result = groupHistoryEvents([], {
      pendingStartDecision: null,
      pendingStartActivities: [],
    });
    expect(result).toEqual({});
  });

  it('should warn if groupId cannot be extracted from an event', () => {
    const events: HistoryEvent[] = [scheduleActivityTaskEvent];
    mockedGetHistoryEventGroupId.mockReturnValue(undefined);
    groupHistoryEvents(events, {
      pendingStartDecision: null,
      pendingStartActivities: [],
    });
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

    groupHistoryEvents(events, {
      pendingStartDecision: null,
      pendingStartActivities: [],
    });

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

    const result = groupHistoryEvents(events, {
      pendingStartDecision: null,
      pendingStartActivities: [],
    });
    expect(result.group1.events).toEqual(events);
  });

  it('should warn when no event handler matches the event type', () => {
    const events: HistoryEvent[] = [
      {
        ...scheduleActivityTaskEvent,
        // @ts-expect-error Type '"fakeAttribute"' is not assignable to type
        attributes: 'fakeAttribute',
      },
    ];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group3');

    const result = groupHistoryEvents(events, {
      pendingStartDecision: null,
      pendingStartActivities: [],
    });

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

  // pending activity start section
  it('should append pending activity start to group that has scheduled activity event only', () => {
    const events: ActivityHistoryEvent[] = [scheduleActivityTaskEvent];
    const pendingStartActivities = [pendingActivityTaskStartEvent];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group1');

    const result = groupHistoryEvents(events, {
      pendingStartDecision: null,
      pendingStartActivities,
    });

    expect(result.group1.events).toEqual([
      ...events,
      ...pendingStartActivities,
    ]);
  });

  it('should append pending activity start with started state to group that has scheduled activity event only', () => {
    const events: ActivityHistoryEvent[] = [scheduleActivityTaskEvent];
    const pendingStartActivities = [
      pendingActivityTaskStartEventWithStartedState,
    ];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group1');

    const result = groupHistoryEvents(events, {
      pendingStartDecision: null,
      pendingStartActivities,
    });

    expect(result.group1.events).toEqual([
      ...events,
      ...pendingStartActivities,
    ]);
  });

  it('should not append pending activity start to group if it does not have scheduled activity event', () => {
    const events: ActivityHistoryEvent[] = [startActivityTaskEvent];
    const pendingStartActivities = [pendingActivityTaskStartEvent];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group1');

    const result = groupHistoryEvents(events, {
      pendingStartDecision: null,
      pendingStartActivities,
    });

    expect(result.group1.events).toEqual(events);
  });

  it('should not append pending activity start to group if group has more than one event', () => {
    const events: ActivityHistoryEvent[] = [
      scheduleActivityTaskEvent,
      startActivityTaskEvent,
    ];
    const pendingStartActivities = [pendingActivityTaskStartEvent];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group1');

    const result = groupHistoryEvents(events, {
      pendingStartDecision: null,
      pendingStartActivities,
    });

    expect(result.group1.events).toEqual(events);
  });

  // pending decision schedule section
  it('should append pending decision start to group that has scheduled decision event only', () => {
    const events: HistoryEvent[] = [scheduleDecisionTaskEvent];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group1');

    const result = groupHistoryEvents(events, {
      pendingStartDecision: pendingDecisionTaskStartEvent,
      pendingStartActivities: [],
    });

    expect(result.group1.events).toEqual([
      ...events,
      pendingDecisionTaskStartEvent,
    ]);
  });

  it('should append pending decision start with started state to group that has scheduled decision event only', () => {
    const events: HistoryEvent[] = [scheduleDecisionTaskEvent];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group1');

    const result = groupHistoryEvents(events, {
      pendingStartDecision: pendingDecisionTaskStartEventWithStartedState,
      pendingStartActivities: [],
    });

    expect(result.group1.events).toEqual([
      ...events,
      pendingDecisionTaskStartEventWithStartedState,
    ]);
  });

  it('should not append pending decision start to group if it does not have scheduled decision event', () => {
    const events: HistoryEvent[] = [startDecisionTaskEvent];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group1');

    const result = groupHistoryEvents(events, {
      pendingStartDecision: pendingDecisionTaskStartEvent,
      pendingStartActivities: [],
    });

    expect(result.group1.events).toEqual(events);
  });

  it('should not append pending decision start to group if group has more than one event', () => {
    const events: HistoryEvent[] = [
      scheduleDecisionTaskEvent,
      startDecisionTaskEvent,
    ];
    (getHistoryEventGroupId as jest.Mock).mockReturnValue('group1');

    const result = groupHistoryEvents(events, {
      pendingStartDecision: pendingDecisionTaskStartEvent,
      pendingStartActivities: [],
    });

    expect(result.group1.events).toEqual(events);
  });
});
