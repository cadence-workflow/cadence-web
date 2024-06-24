import formatWorkflowHistoryEventType from '../format-workflow-history-event-type';

describe('formatWorkflowHistoryEventType', () => {
  it('should capitalize the first letter and remove "EventAttributes" from the string', () => {
    const input = 'workflowExecutionStartedEventAttributes';
    const expectedOutput = 'WorkflowExecutionStarted';
    expect(formatWorkflowHistoryEventType(input)).toEqual(expectedOutput);
  });

  it('should handle strings without "EventAttributes" correctly', () => {
    const input = 'workflowExecutionStarted';
    const expectedOutput = 'WorkflowExecutionStarted';
    expect(formatWorkflowHistoryEventType(input)).toEqual(expectedOutput);
  });

  it('should handle empty strings correctly', () => {
    const input = '';
    const expectedOutput = '';
    expect(formatWorkflowHistoryEventType(input)).toEqual(expectedOutput);
  });

  it('should handle null input correctly', () => {
    const input = null;
    const expectedOutput = null;
    // @ts-expect-error Testing null
    expect(formatWorkflowHistoryEventType(input)).toEqual(expectedOutput);
  });

  it('should handle undefined input correctly', () => {
    const input = undefined;
    const expectedOutput = undefined;
    // @ts-expect-error Testing null
    expect(formatWorkflowHistoryEventType(input)).toEqual(expectedOutput);
  });

  it('should handle single-character input correctly', () => {
    const input = 'a';
    const expectedOutput = 'A';
    expect(formatWorkflowHistoryEventType(input)).toEqual(expectedOutput);
  });

  it('should handle strings that start with a capital letter correctly', () => {
    const input = 'WorkflowExecutionStartedEventAttributes';
    const expectedOutput = 'WorkflowExecutionStarted';
    expect(formatWorkflowHistoryEventType(input)).toEqual(expectedOutput);
  });

  it('should handle strings that are already in the correct format', () => {
    const input = 'WorkflowExecutionStarted';
    const expectedOutput = 'WorkflowExecutionStarted';
    expect(formatWorkflowHistoryEventType(input)).toEqual(expectedOutput);
  });
});
