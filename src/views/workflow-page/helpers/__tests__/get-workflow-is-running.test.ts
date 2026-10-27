import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';
import {
  completeWorkflowExecutionEvent,
  startWorkflowExecutionEvent,
} from '@/views/workflow-history/__fixtures__/workflow-history-single-events';

import getWorkflowIsRunning from '../get-workflow-is-running';

describe(getWorkflowIsRunning.name, () => {
  it('returns true when there is no close event', () => {
    expect(getWorkflowIsRunning(null)).toBe(true);
  });

  it('returns true when the close event has no attributes', () => {
    expect(getWorkflowIsRunning({} as HistoryEvent)).toBe(true);
  });

  it('returns false when the close event is a completion', () => {
    expect(
      getWorkflowIsRunning(completeWorkflowExecutionEvent as HistoryEvent)
    ).toBe(false);
  });

  it('returns true when the event is not a completion', () => {
    expect(
      getWorkflowIsRunning(startWorkflowExecutionEvent as HistoryEvent)
    ).toBe(true);
  });
});
