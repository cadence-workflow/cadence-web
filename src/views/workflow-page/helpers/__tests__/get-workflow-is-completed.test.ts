// Import the function to be tested
import getWorkflowIsCompleted from '../get-workflow-is-completed';

describe('getWorkflowIsCompleted', () => {
  const workflowCompletedAttributes = [
    'workflowExecutionCancelRequestedEventAttributes',
    'workflowExecutionCanceledEventAttributes',
    'workflowExecutionCompletedEventAttributes',
    'workflowExecutionContinuedAsNewEventAttributes',
    'workflowExecutionFailedEventAttributes',
    'workflowExecutionTerminatedEventAttributes',
  ];

  it('should return true for attributes in the workflowCompletedAttributes list', () => {
    workflowCompletedAttributes.forEach((attribute) => {
      expect(getWorkflowIsCompleted(attribute)).toBe(true);
    });
  });

  it('should return false for attributes not in the workflowCompletedAttributes list', () => {
    const nonCompletedAttributes = [
      'someOtherEventAttributes',
      'anotherEventAttributes',
      'yetAnotherEventAttributes',
    ];

    nonCompletedAttributes.forEach((attribute) => {
      expect(getWorkflowIsCompleted(attribute)).toBe(false);
    });
  });

  it('should return false for an empty string', () => {
    expect(getWorkflowIsCompleted('')).toBe(false);
  });

  it('should return false for undefined', () => {
    // @ts-expect-error Testing undefined
    expect(getWorkflowIsCompleted(undefined)).toBe(false);
  });

  it('should return false for null', () => {
    // @ts-expect-error Testing null
    expect(getWorkflowIsCompleted(null)).toBe(false);
  });
});
