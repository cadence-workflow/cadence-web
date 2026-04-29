import getWorkflowIsError from '../get-workflow-is-error';

describe('getWorkflowIsError', () => {
  it('should return true for error attributes', () => {
    expect(getWorkflowIsError('workflowExecutionFailedEventAttributes')).toBe(
      true
    );
    expect(
      getWorkflowIsError('workflowExecutionTerminatedEventAttributes')
    ).toBe(true);
    expect(getWorkflowIsError('workflowExecutionTimedOutEventAttributes')).toBe(
      true
    );
  });

  it('should return false for non-error completed attributes', () => {
    const nonErrorAttributes = [
      'workflowExecutionCompletedEventAttributes',
      'workflowExecutionCanceledEventAttributes',
      'workflowExecutionContinuedAsNewEventAttributes',
    ];

    nonErrorAttributes.forEach((attribute) => {
      expect(getWorkflowIsError(attribute)).toBe(false);
    });
  });

  it('should return false for an empty string', () => {
    expect(getWorkflowIsError('')).toBe(false);
  });

  it('should return false for undefined', () => {
    // @ts-expect-error Testing undefined
    expect(getWorkflowIsError(undefined)).toBe(false);
  });

  it('should return false for null', () => {
    // @ts-expect-error Testing null
    expect(getWorkflowIsError(null)).toBe(false);
  });
});
