import formatWorkflowExecutionCancelRequestedEventAttributes from '../format-workflow-execution-cancel-requested-event-attributes';

describe('formatWorkflowExecutionCancelRequestedEventAttributes', () => {
  test('should return formatted attributes with valid externalExecutionInfo', () => {
    const externalExecutionInfo = {
      initiatedId: '123',
      workflowExecution: { workflowId: 'workflowId', runId: 'runId' },
    };

    const formattedAttributes =
      formatWorkflowExecutionCancelRequestedEventAttributes({
        externalExecutionInfo,
        otherAttribute: 'value',
      });

    expect(formattedAttributes).toEqual({
      externalInitiatedEventId: 123,
      externalWorkflowExecution: { workflowId: 'workflowId', runId: 'runId' },
      otherAttribute: 'value',
    });
  });

  test('should handle null externalExecutionInfo', () => {
    const formattedAttributes =
      formatWorkflowExecutionCancelRequestedEventAttributes({
        externalExecutionInfo: null,
        otherAttribute: 'value',
      });

    expect(formattedAttributes).toEqual({
      externalInitiatedEventId: null,
      externalWorkflowExecution: undefined,
      otherAttribute: 'value',
    });
  });

  test('should handle undefined externalExecutionInfo', () => {
    const formattedAttributes =
      formatWorkflowExecutionCancelRequestedEventAttributes({
        otherAttribute: 'value',
      });

    expect(formattedAttributes).toEqual({
      externalInitiatedEventId: null,
      externalWorkflowExecution: undefined,
      otherAttribute: 'value',
    });
  });

  test('should handle missing initiatedId in externalExecutionInfo', () => {
    const externalExecutionInfo = {
      workflowExecution: { workflowId: 'workflowId', runId: 'runId' },
    };

    const formattedAttributes =
      formatWorkflowExecutionCancelRequestedEventAttributes({
        // @ts-ignore - initiatedId is missing intentionally
        externalExecutionInfo,
        otherAttribute: 'value',
      });

    expect(formattedAttributes).toEqual({
      externalInitiatedEventId: null,
      externalWorkflowExecution: { workflowId: 'workflowId', runId: 'runId' },
      otherAttribute: 'value',
    });
  });
});
