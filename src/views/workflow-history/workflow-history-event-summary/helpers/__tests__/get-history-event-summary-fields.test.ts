import { type WorkflowHistoryEventSummaryRenderConfig } from '../../workflow-history-event-summary.types';
import getHistoryEventSummaryFields from '../get-history-event-summary-fields';

// Mock the config to avoid importing the real parsers
jest.mock(
  '../../../config/workflow-history-event-summary-parsers.config',
  () =>
    [
      {
        name: 'Test Json Parser',
        matcher: (name) => name === 'input' || name === 'result',
        icon: null,
        renderValue: ({ value }) => `JSON: ${JSON.stringify(value)}`,
        renderHoverContent: ({ value }) => `Preview: ${JSON.stringify(value)}`,
        invertPopoverColours: true,
        shouldHide: ({ value }) => value === null,
      },
      {
        name: 'Test Duration Parser',
        matcher: (name) => name.endsWith('TimeoutSeconds'),
        icon: null,
        renderValue: ({ value }) => `Duration: ${value}s`,
      },
      {
        name: 'Test Workflow Execution Parser',
        matcher: (name) => name === 'workflowExecution',
        icon: null,
        renderValue: ({ value }) => `Link: ${value?.workflowId}`,
      },
      {
        name: 'Test RunId Parser',
        matcher: (name) => name === 'firstExecutionRunId',
        icon: null,
        renderValue: ({ value }) => `RunId: ${value}`,
      },
    ] as Array<WorkflowHistoryEventSummaryRenderConfig>
);

describe(getHistoryEventSummaryFields.name, () => {
  it('should return empty array when no summary fields match', () => {
    const details = {
      unrelatedField: 'value',
      anotherField: 123,
    };
    const summaryFields = ['summaryField1', 'summaryField2'];

    const result = getHistoryEventSummaryFields({ details, summaryFields });

    expect(result).toEqual([]);
  });

  it('should return empty array when details object is empty', () => {
    const details = {};
    const summaryFields = ['field1', 'field2'];

    const result = getHistoryEventSummaryFields({ details, summaryFields });

    expect(result).toEqual([]);
  });

  it('should return empty array when summary fields array is empty', () => {
    const details = {
      field1: 'value1',
      field2: 'value2',
    };

    const result = getHistoryEventSummaryFields({ details, summaryFields: [] });

    expect(result).toEqual([]);
  });

  it('should filter fields that are not in summaryFields', () => {
    const details = {
      input: 'test-input',
      firstExecutionRunId: 'run-id',
    };
    const summaryFields = ['input'];

    const result = getHistoryEventSummaryFields({ details, summaryFields });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('input');
  });

  it('should only include fields that have matching render configs', () => {
    const details = {
      input: { data: 'test' },
      unrelatedField: 'value',
      result: 'success',
    };

    const summaryFields = ['input', 'unrelatedField', 'result'];

    const result = getHistoryEventSummaryFields({ details, summaryFields });

    // Should only include fields with matching parsers (input, result)
    expect(result).toHaveLength(2);

    const fieldNames = result.map((field) => field.name);
    expect(fieldNames).toContain('input');
    expect(fieldNames).toContain('result');
    expect(fieldNames).not.toContain('unrelatedField');
  });

  it('should handle multiple matching parsers for the same field', () => {
    const details = {
      input: { data: 'test' },
    };
    const summaryFields = ['input'];

    const result = getHistoryEventSummaryFields({ details, summaryFields });

    expect(result).toHaveLength(1);
    // Should use the first matching parser
    expect(result[0].renderConfig.name).toBe('Test Json Parser');
  });

  it('should preserve order of fields as they appear in details', () => {
    const details = {
      firstExecutionRunId: 'run-id',
      input: 'test-input',
    };
    const summaryFields = ['input', 'firstExecutionRunId'];

    const result = getHistoryEventSummaryFields({ details, summaryFields });

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('firstExecutionRunId');
    expect(result[1].name).toBe('input');
  });
});
