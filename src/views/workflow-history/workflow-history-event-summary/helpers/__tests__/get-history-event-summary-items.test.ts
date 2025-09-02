import { type WorkflowHistoryEventDetailsEntries } from '@/views/workflow-history/workflow-history-event-details/workflow-history-event-details.types';

import * as generateHistoryEventDetailsModule from '../../../workflow-history-event-details/helpers/generate-history-event-details';
import { type WorkflowHistoryEventSummaryFieldParser } from '../../workflow-history-event-summary.types';
import getHistoryEventSummaryItems from '../get-history-event-summary-items';

// Mock the generateHistoryEventDetails module
jest.mock(
  '../../../workflow-history-event-details/helpers/generate-history-event-details',
  () =>
    jest.fn(
      () =>
        [
          {
            key: 'input',
            path: 'input',
            value: { data: 'test' },
            renderConfig: {
              name: 'Test Config',
              key: 'test',
              getLabel: ({ path }) => `Label: ${path}`,
              valueComponent: jest.fn(),
            },
            isGroup: false,
          },
          {
            key: 'result',
            path: 'result',
            value: 'success',
            renderConfig: {
              name: 'Test Config',
              key: 'test',
              getLabel: ({ path }) => `Label: ${path}`,
              valueComponent: jest.fn(),
            },
            isGroup: false,
          },
          {
            key: 'timeout',
            path: 'timeout',
            value: 30,
            renderConfig: {
              name: 'Test Config',
              key: 'test',
              getLabel: ({ path }) => `Label: ${path}`,
              valueComponent: jest.fn(),
            },
            isGroup: false,
          },
          {
            key: 'workflowExecution',
            path: 'workflowExecution',
            value: { workflowId: 'test-workflow' },
            renderConfig: {
              name: 'Test Config',
              key: 'test',
              getLabel: ({ path }) => `Label: ${path}`,
              valueComponent: jest.fn(),
            },
            isGroup: false,
          },
          {
            key: 'firstExecutionRunId',
            path: 'firstExecutionRunId',
            value: 'run-id-123',
            renderConfig: {
              name: 'Test Config',
              key: 'test',
              getLabel: ({ path }) => `Label: ${path}`,
              valueComponent: jest.fn(),
            },
            isGroup: false,
          },
          {
            key: 'groupField',
            path: 'groupField',
            renderConfig: {
              name: 'Test Config',
              key: 'test',
            },
            isGroup: true,
            groupEntries: [],
          },
        ] satisfies WorkflowHistoryEventDetailsEntries
    )
);

// Mock the parser config
jest.mock(
  '../../../config/workflow-history-event-summary-field-parsers.config',
  () =>
    [
      {
        name: 'Json Parser',
        matcher: (path) => path === 'input' || path === 'result',
        icon: null,
        customRenderValue: jest.fn(),
        hideDefaultTooltip: true,
      },
      {
        name: 'Timeout Parser',
        matcher: (path) => path.endsWith('TimeoutSeconds'),
        icon: jest.fn(),
      },
      {
        name: 'Workflow Execution Parser',
        matcher: (path) => path === 'workflowExecution',
        icon: jest.fn(),
      },
      {
        name: 'RunId Parser',
        matcher: (path) => path === 'firstExecutionRunId',
        icon: jest.fn(),
      },
    ] satisfies Array<WorkflowHistoryEventSummaryFieldParser>
);

describe(getHistoryEventSummaryItems.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return empty array when no summary fields match', () => {
    const details = { unrelatedField: 'value' };
    const summaryFields = ['summaryField1', 'summaryField2'];

    jest
      .spyOn(generateHistoryEventDetailsModule, 'default')
      .mockReturnValueOnce([
        {
          key: 'unrelatedField',
          path: 'unrelatedField',
          value: 'value',
          renderConfig: {
            name: 'Test Config',
            key: 'test',
          },
          isGroup: false,
        },
      ]);

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    expect(result).toEqual([]);
  });

  it('should return empty array when details object is empty', () => {
    const details = {};
    const summaryFields = ['field1', 'field2'];

    jest
      .spyOn(generateHistoryEventDetailsModule, 'default')
      .mockReturnValueOnce([]);

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    expect(result).toEqual([]);
  });

  it('should return empty array when summary fields array is empty', () => {
    const details = { field1: 'value1' };

    jest
      .spyOn(generateHistoryEventDetailsModule, 'default')
      .mockReturnValueOnce([]);

    const result = getHistoryEventSummaryItems({ details, summaryFields: [] });

    expect(result).toEqual([]);
  });

  it('should filter fields that are not in summaryFields', () => {
    const details = { input: 'test-input', firstExecutionRunId: 'run-id' };
    const summaryFields = ['input'];

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('input');
    expect(result[0].label).toBe('Label: input');
    expect(result[0].value).toEqual({ data: 'test' });
  });

  it('should only include fields that have matching parser configs', () => {
    const details = {
      input: { data: 'test' },
      unrelatedField: 'value',
      result: 'success',
    };
    const summaryFields = ['input', 'unrelatedField', 'result'];

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    // Should only include fields with matching parsers (input, result)
    expect(result).toHaveLength(2);

    const fieldPaths = result.map((field) => field.path);
    expect(fieldPaths).toContain('input');
    expect(fieldPaths).toContain('result');
    expect(fieldPaths).not.toContain('unrelatedField');
  });

  it('should handle fields with custom render values from parser config', () => {
    const details = { input: { data: 'test' } };
    const summaryFields = ['input'];

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('input');
    expect(result[0].hideDefaultTooltip).toBe(true);
  });

  it('should handle fields with icons from parser config', () => {
    const details = { timeout: 30 };
    const summaryFields = ['timeout'];

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('timeout');
    expect(result[0].icon).toBeDefined();
  });

  it('should use default render value when no custom render value is available', () => {
    const details = { unrelatedField: 'value' };
    const summaryFields = ['unrelatedField'];

    // Mock a field without a custom render value
    jest
      .spyOn(generateHistoryEventDetailsModule, 'default')
      .mockReturnValueOnce([
        {
          key: 'unrelatedField',
          path: 'unrelatedField',
          value: 'value',
          renderConfig: {
            name: 'Test Config',
            key: 'test',
          },
          isGroup: false,
        },
      ]);

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('unrelatedField');
    expect(result[0].renderValue).toBeDefined();
  });

  it('should skip group entries', () => {
    const details = { groupField: { nested: 'value' } };
    const summaryFields = ['groupField'];

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    expect(result).toHaveLength(0);
  });

  it('should order summary fields based on field order in summaryFields', () => {
    const details = { input: 'test-input', firstExecutionRunId: 'run-id' };
    const summaryFields = ['firstExecutionRunId', 'input'];

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    expect(result).toHaveLength(2);
    expect(result[0].path).toBe('firstExecutionRunId');
    expect(result[1].path).toBe('input');
  });

  it('should handle fields with renderConfig.valueComponent', () => {
    const details = { workflowExecution: { workflowId: 'test-workflow' } };
    const summaryFields = ['workflowExecution'];

    const result = getHistoryEventSummaryItems({ details, summaryFields });

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('workflowExecution');
    expect(result[0].renderValue).toBeDefined();
  });
});
