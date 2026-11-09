import getWorkflowIsRunning from '../get-workflow-is-running';

describe(getWorkflowIsRunning.name, () => {
  it('returns true when there is no close event', () => {
    expect(getWorkflowIsRunning(undefined)).toBe(true);
    expect(getWorkflowIsRunning(null)).toBe(true);
  });

  it('returns true when the close event has empty attributes', () => {
    expect(getWorkflowIsRunning('')).toBe(true);
  });

  it('returns false when the close event is a completion', () => {
    expect(
      getWorkflowIsRunning('workflowExecutionCompletedEventAttributes')
    ).toBe(false);
  });

  it('returns true when the event is not a completion', () => {
    expect(
      getWorkflowIsRunning('workflowExecutionStartedEventAttributes')
    ).toBe(true);
  });
});
