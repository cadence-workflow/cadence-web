import { type Timestamp } from '@/__generated__/proto-ts/google/protobuf/Timestamp';
import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskStartEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-pending-events';
import { startWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';
import { type HistoryEventsGroup } from '@/views/workflow-history/workflow-history.types';

import { type UngroupedEventInfo } from '../../workflow-history-ungrouped-table.types';
import compareUngroupedEvents from '../compare-ungrouped-events';

function createMockEventGroup(
  label: string,
  event: UngroupedEventInfo['event']
): HistoryEventsGroup {
  return {
    groupType: 'Event',
    label,
    eventsMetadata: [],
    status: 'COMPLETED',
    hasMissingEvents: false,
    timeMs: null,
    startTimeMs: null,
    timeLabel: '',
    firstEventId: null,
    events: [event],
  } as HistoryEventsGroup;
}

describe(compareUngroupedEvents.name, () => {
  it('orders non-pending events by event ID', () => {
    const eventA: UngroupedEventInfo = {
      id: '1',
      label: 'Event A',
      event: startWorkflowExecutionEvent,
      eventGroup: createMockEventGroup('Event A', startWorkflowExecutionEvent),
    };
    const eventB: UngroupedEventInfo = {
      id: '2',
      label: 'Event B',
      event: startWorkflowExecutionEvent,
      eventGroup: createMockEventGroup('Event B', startWorkflowExecutionEvent),
    };

    expect(compareUngroupedEvents(eventA, eventB)).toBe(-1);
    expect(compareUngroupedEvents(eventB, eventA)).toBe(1);
    expect(compareUngroupedEvents(eventA, eventA)).toBe(0);
  });

  it('puts non-pending events before pending events', () => {
    const nonPendingEvent: UngroupedEventInfo = {
      id: '2',
      label: 'Non-pending Event',
      event: startWorkflowExecutionEvent,
      eventGroup: createMockEventGroup(
        'Non-pending Event',
        startWorkflowExecutionEvent
      ),
    };
    const pendingEvent: UngroupedEventInfo = {
      id: '1',
      label: 'Pending Event',
      event: pendingActivityTaskStartEvent,
      eventGroup: createMockEventGroup(
        'Pending Event',
        pendingActivityTaskStartEvent
      ),
    };

    expect(compareUngroupedEvents(nonPendingEvent, pendingEvent)).toBe(-1);
    expect(compareUngroupedEvents(pendingEvent, nonPendingEvent)).toBe(1);
  });

  it('orders pending events by event time', () => {
    const eventTimeA: Timestamp = { seconds: '1000', nanos: 0 };
    const eventTimeB: Timestamp = { seconds: '2000', nanos: 0 };

    const eventA = {
      ...pendingActivityTaskStartEvent,
      eventTime: eventTimeA,
    };
    const eventB = {
      ...pendingDecisionTaskStartEvent,
      eventTime: eventTimeB,
    };

    const pendingEventA: UngroupedEventInfo = {
      id: '1',
      label: 'Pending Event A',
      event: eventA,
      eventGroup: createMockEventGroup('Pending Event A', eventA),
    };
    const pendingEventB: UngroupedEventInfo = {
      id: '2',
      label: 'Pending Event B',
      event: eventB,
      eventGroup: createMockEventGroup('Pending Event B', eventB),
    };

    expect(compareUngroupedEvents(pendingEventA, pendingEventB)).toBe(-1000000);
    expect(compareUngroupedEvents(pendingEventB, pendingEventA)).toBe(1000000);
    expect(compareUngroupedEvents(pendingEventA, pendingEventA)).toBe(0);
  });

  it('returns 0 when pending events have no event time', () => {
    const eventA = {
      ...pendingActivityTaskStartEvent,
      eventTime: null,
    };
    const eventB = {
      ...pendingDecisionTaskStartEvent,
      eventTime: null,
    };

    const pendingEventA: UngroupedEventInfo = {
      id: '1',
      label: 'Pending Event A',
      event: eventA,
      eventGroup: createMockEventGroup('Pending Event A', eventA),
    };
    const pendingEventB: UngroupedEventInfo = {
      id: '2',
      label: 'Pending Event B',
      event: eventB,
      eventGroup: createMockEventGroup('Pending Event B', eventB),
    };

    expect(compareUngroupedEvents(pendingEventA, pendingEventB)).toBe(0);
  });
});
