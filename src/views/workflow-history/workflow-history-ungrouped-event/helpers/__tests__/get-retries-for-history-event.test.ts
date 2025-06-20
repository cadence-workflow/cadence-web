import { scheduleDecisionTaskEvent } from '../../../__fixtures__/workflow-history-decision-events';
import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskStartEvent,
} from '../../../__fixtures__/workflow-history-pending-events';
import {
  startWorkflowExecutionEvent,
  failCancelTimerEvent,
} from '../../../__fixtures__/workflow-history-single-events';
import getRetriesForHistoryEvent from '../get-retries-for-history-event';

describe(getRetriesForHistoryEvent.name, () => {
  it('returns undefined for regular events', () => {
    expect(getRetriesForHistoryEvent(failCancelTimerEvent)).toBeUndefined();
  });

  it('returns attempt count for workflow execution started events with retries', () => {
    const event = {
      ...startWorkflowExecutionEvent,
      workflowExecutionStartedEventAttributes: {
        ...startWorkflowExecutionEvent.workflowExecutionStartedEventAttributes,
        attempt: 2,
      },
    };
    expect(getRetriesForHistoryEvent(event)).toBe(2);
  });

  it('returns attempt count for decision task scheduled events with retries', () => {
    const event = {
      ...scheduleDecisionTaskEvent,
      decisionTaskScheduledEventAttributes: {
        ...scheduleDecisionTaskEvent.decisionTaskScheduledEventAttributes,
        attempt: 3,
      },
    };
    expect(getRetriesForHistoryEvent(event)).toBe(3);
  });

  it('returns attempt count for pending activity events', () => {
    expect(getRetriesForHistoryEvent(pendingActivityTaskStartEvent)).toBe(1);
  });

  it('returns attempt count for pending decision events', () => {
    expect(getRetriesForHistoryEvent(pendingDecisionTaskStartEvent)).toBe(1);
  });

  it('returns undefined for pending events with no attempt count', () => {
    const eventWithoutAttempt = {
      ...pendingActivityTaskStartEvent,
      pendingActivityTaskStartEventAttributes: {
        ...pendingActivityTaskStartEvent.pendingActivityTaskStartEventAttributes,
        attempt: 0,
      },
    };
    expect(getRetriesForHistoryEvent(eventWithoutAttempt)).toBeUndefined();
  });
});
