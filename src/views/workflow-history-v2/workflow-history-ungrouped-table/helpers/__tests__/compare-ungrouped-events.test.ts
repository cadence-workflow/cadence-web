import { type Timestamp } from '@/__generated__/proto-ts/google/protobuf/Timestamp';
import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskStartEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-pending-events';
import { startWorkflowExecutionEvent } from '@/views/workflow-history/__fixtures__/workflow-history-single-events';
import {
  type HistoryEventsGroup,
  type HistoryGroupEventMetadata,
} from '@/views/workflow-history/workflow-history.types';

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

function createMockEventMetadata(label: string): HistoryGroupEventMetadata {
  return {
    label,
    status: 'COMPLETED',
    timeMs: null,
    timeLabel: '',
  };
}

describe(compareUngroupedEvents.name, () => {
  it('orders non-pending events by event ID', () => {
    const eventA: UngroupedEventInfo = {
      id: '1',
      groupId: 'groupId',
      label: 'Event A',
      event: startWorkflowExecutionEvent,
      eventMetadata: createMockEventMetadata('Event A'),
      eventGroup: createMockEventGroup('Event A', startWorkflowExecutionEvent),
    };
    const eventB: UngroupedEventInfo = {
      id: '2',
      groupId: 'groupId',
      label: 'Event B',
      event: startWorkflowExecutionEvent,
      eventMetadata: createMockEventMetadata('Event B'),
      eventGroup: createMockEventGroup('Event B', startWorkflowExecutionEvent),
    };

    expect(compareUngroupedEvents(eventA, eventB)).toBe(-1);
    expect(compareUngroupedEvents(eventB, eventA)).toBe(1);
    expect(compareUngroupedEvents(eventA, eventA)).toBe(0);
  });

  it('puts non-pending events before pending events', () => {
    const nonPendingEvent: UngroupedEventInfo = {
      id: '2',
      groupId: 'groupId',
      label: 'Non-pending Event',
      event: startWorkflowExecutionEvent,
      eventMetadata: createMockEventMetadata('Non-pending Event'),
      eventGroup: createMockEventGroup(
        'Non-pending Event',
        startWorkflowExecutionEvent
      ),
    };
    const pendingEvent: UngroupedEventInfo = {
      id: '1',
      groupId: 'groupId',
      label: 'Pending Event',
      event: pendingActivityTaskStartEvent,
      eventMetadata: createMockEventMetadata('Pending Event'),
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
      groupId: 'groupId',
      label: 'Pending Event A',
      event: eventA,
      eventMetadata: createMockEventMetadata('Pending Event A'),
      eventGroup: createMockEventGroup('Pending Event A', eventA),
    };
    const pendingEventB: UngroupedEventInfo = {
      id: '2',
      groupId: 'groupId',
      label: 'Pending Event B',
      event: eventB,
      eventMetadata: createMockEventMetadata('Pending Event B'),
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
      groupId: 'groupId',
      label: 'Pending Event A',
      event: eventA,
      eventMetadata: createMockEventMetadata('Pending Event A'),
      eventGroup: createMockEventGroup('Pending Event A', eventA),
    };
    const pendingEventB: UngroupedEventInfo = {
      id: '2',
      groupId: 'groupId',
      label: 'Pending Event B',
      event: eventB,
      eventMetadata: createMockEventMetadata('Pending Event B'),
      eventGroup: createMockEventGroup('Pending Event B', eventB),
    };

    expect(compareUngroupedEvents(pendingEventA, pendingEventB)).toBe(0);
  });
});
