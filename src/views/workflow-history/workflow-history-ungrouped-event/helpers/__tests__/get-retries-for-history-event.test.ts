import {
  pendingActivityTaskStartEvent,
  pendingDecisionTaskStartEvent,
} from '../../../__fixtures__/workflow-history-pending-events';
import { startWorkflowExecutionEvent } from '../../../__fixtures__/workflow-history-single-events';
import getRetriesForHistoryEvent from '../get-retries-for-history-event';

describe(getRetriesForHistoryEvent.name, () => {
  it('returns undefined for regular events', () => {
    expect(
      getRetriesForHistoryEvent(startWorkflowExecutionEvent)
    ).toBeUndefined();
  });

  it('returns undefined for pending events with no retries', () => {
    expect(
      getRetriesForHistoryEvent({
        ...pendingActivityTaskStartEvent,
        pendingActivityTaskStartEventAttributes: {
          ...pendingActivityTaskStartEvent.pendingActivityTaskStartEventAttributes,
          attempt: 0,
        },
      })
    ).toBeUndefined();

    expect(
      getRetriesForHistoryEvent({
        ...pendingDecisionTaskStartEvent,
        pendingDecisionTaskStartEventAttributes: {
          ...pendingDecisionTaskStartEvent.pendingDecisionTaskStartEventAttributes,
          attempt: 0,
        },
      })
    ).toBeUndefined();
  });

  it('returns attempt count for pending activity events with retries', () => {
    expect(getRetriesForHistoryEvent(pendingActivityTaskStartEvent)).toBe(1);
  });

  it('returns attempt count for pending decision events with retries', () => {
    expect(getRetriesForHistoryEvent(pendingDecisionTaskStartEvent)).toBe(1);
  });
});
