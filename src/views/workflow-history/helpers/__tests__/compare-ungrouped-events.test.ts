import { type Timestamp } from '@/__generated__/proto-ts/google/protobuf/Timestamp';

import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskStartEvent,
} from '../../__fixtures__/workflow-history-pending-events';
import { startWorkflowExecutionEvent } from '../../__fixtures__/workflow-history-single-events';
import { type WorkflowEventStatus } from '../../workflow-history-event-status-badge/workflow-history-event-status-badge.types';
import compareUngroupedEvents from '../compare-ungrouped-events';

describe(compareUngroupedEvents.name, () => {
  it('orders non-pending events by event ID', () => {
    const eventA = {
      id: '1',
      label: 'Event A',
      status: 'COMPLETED' as WorkflowEventStatus,
      statusLabel: 'Completed',
      event: startWorkflowExecutionEvent,
      eventMetadata: {
        label: 'Completed',
        status: 'COMPLETED' as WorkflowEventStatus,
        timeMs: 1704067200000,
        timeLabel: 'Completed at 2024-01-01 12:00:00',
      },
    };
    const eventB = {
      id: '2',
      label: 'Event B',
      status: 'COMPLETED' as WorkflowEventStatus,
      statusLabel: 'Completed',
      event: startWorkflowExecutionEvent,
      eventMetadata: {
        label: 'Completed',
        status: 'COMPLETED' as WorkflowEventStatus,
        timeMs: 1704067200000,
        timeLabel: 'Completed at 2024-01-01 12:00:00',
      },
    };

    expect(compareUngroupedEvents(eventA, eventB)).toBe(-1);
    expect(compareUngroupedEvents(eventB, eventA)).toBe(1);
    expect(compareUngroupedEvents(eventA, eventA)).toBe(0);
  });

  it('puts non-pending events before pending events', () => {
    const nonPendingEvent = {
      id: '2',
      label: 'Non-pending Event',
      status: 'COMPLETED' as WorkflowEventStatus,
      statusLabel: 'Completed',
      event: startWorkflowExecutionEvent,
      eventMetadata: {
        label: 'Completed',
        status: 'COMPLETED' as WorkflowEventStatus,
        timeMs: 1704067200000,
        timeLabel: 'Completed at 2024-01-01 12:00:00',
      },
    };
    const pendingEvent = {
      id: '1',
      label: 'Pending Event',
      status: 'WAITING' as WorkflowEventStatus,
      statusLabel: 'Waiting',
      event: pendingActivityTaskStartEvent,
      eventMetadata: {
        label: 'Waiting',
        status: 'WAITING' as WorkflowEventStatus,
        timeMs: null,
        timeLabel: 'Pending',
      },
    };

    expect(compareUngroupedEvents(nonPendingEvent, pendingEvent)).toBe(-1);
    expect(compareUngroupedEvents(pendingEvent, nonPendingEvent)).toBe(1);
  });

  it('orders pending events by event time', () => {
    const eventTimeA: Timestamp = { seconds: '1000', nanos: 0 };
    const eventTimeB: Timestamp = { seconds: '2000', nanos: 0 };

    const pendingEventA = {
      id: '1',
      label: 'Pending Event A',
      status: 'WAITING' as WorkflowEventStatus,
      statusLabel: 'Waiting',
      event: {
        ...pendingActivityTaskStartEvent,
        eventTime: eventTimeA,
      },
      eventMetadata: {
        label: 'Waiting',
        status: 'WAITING' as WorkflowEventStatus,
        timeMs: 1000000,
        timeLabel: 'Waiting at 1970-01-01 00:16:40',
      },
    };
    const pendingEventB = {
      id: '2',
      label: 'Pending Event B',
      status: 'WAITING' as WorkflowEventStatus,
      statusLabel: 'Waiting',
      event: {
        ...pendingDecisionTaskStartEvent,
        eventTime: eventTimeB,
      },
      eventMetadata: {
        label: 'Waiting',
        status: 'WAITING' as WorkflowEventStatus,
        timeMs: 2000000,
        timeLabel: 'Waiting at 1970-01-01 00:33:20',
      },
    };

    expect(compareUngroupedEvents(pendingEventA, pendingEventB)).toBe(-1000000);
    expect(compareUngroupedEvents(pendingEventB, pendingEventA)).toBe(1000000);
    expect(compareUngroupedEvents(pendingEventA, pendingEventA)).toBe(0);
  });

  it('returns 0 when pending events have no event time', () => {
    const pendingEventA = {
      id: '1',
      label: 'Pending Event A',
      status: 'WAITING' as WorkflowEventStatus,
      statusLabel: 'Waiting',
      event: {
        ...pendingActivityTaskStartEvent,
        eventTime: null,
      },
      eventMetadata: {
        label: 'Waiting',
        status: 'WAITING' as WorkflowEventStatus,
        timeMs: null,
        timeLabel: 'Pending',
      },
    };
    const pendingEventB = {
      id: '2',
      label: 'Pending Event B',
      status: 'WAITING' as WorkflowEventStatus,
      statusLabel: 'Waiting',
      event: {
        ...pendingDecisionTaskStartEvent,
        eventTime: null,
      },
      eventMetadata: {
        label: 'Waiting',
        status: 'WAITING' as WorkflowEventStatus,
        timeMs: null,
        timeLabel: 'Pending',
      },
    };

    expect(compareUngroupedEvents(pendingEventA, pendingEventB)).toBe(0);
  });
});
