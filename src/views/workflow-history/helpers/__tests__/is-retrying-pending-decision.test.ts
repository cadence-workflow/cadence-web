import { pendingDecisionTaskStartEvent } from '../../__fixtures__/workflow-history-pending-events';
import isRetryingPendingDecision from '../is-retrying-pending-decision';

describe(isRetryingPendingDecision.name, () => {
  it('returns true when attempt is greater than 0', () => {
    expect(isRetryingPendingDecision(pendingDecisionTaskStartEvent)).toBe(true);
  });

  it('returns false when attempt is 0', () => {
    expect(
      isRetryingPendingDecision({
        ...pendingDecisionTaskStartEvent,
        pendingDecisionTaskStartEventAttributes: {
          ...pendingDecisionTaskStartEvent.pendingDecisionTaskStartEventAttributes,
          attempt: 0,
        },
      })
    ).toBe(false);
  });
});
