import type { StartWorkflowFormData } from '../../workflow-action-start-form.types';
import transformStartWorkflowFormToSubmission from '../transform-start-workflow-form-to-submission';

describe('transformStartWorkflowFormToSubmission', () => {
  const baseFormData: StartWorkflowFormData = {
    workflowType: { name: 'TestWorkflow' },
    taskList: { name: 'test-task-list' },
    workerSDKLanguage: 'JAVA',
    executionStartToCloseTimeoutSeconds: 300,
    scheduleType: 'NOW',
  };

  it('should transform basic form data correctly', () => {
    const result = transformStartWorkflowFormToSubmission(baseFormData);

    expect(result).toEqual({
      workflowType: { name: 'TestWorkflow' },
      taskList: { name: 'test-task-list' },
      workerSDKLanguage: 'JAVA',
      executionStartToCloseTimeoutSeconds: 300,
    });
  });

  it('should include firstRunAt when scheduleType is LATER', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      scheduleType: 'LATER',
      firstRunAt: '2024-01-01T10:00:00Z',
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.firstRunAt).toBe('2024-01-01T10:00:00Z');
  });

  it('should include cronSchedule when scheduleType is CRON', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      scheduleType: 'CRON',
      cronSchedule: {
        minutes: '0',
        hours: '9',
        daysOfMonth: '*',
        months: '*',
        daysOfWeek: '1-5',
      },
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.cronSchedule).toBe('0 9 * * 1-5');
  });

  it('should not include schedule fields when scheduleType is NOW', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      scheduleType: 'NOW',
      firstRunAt: '2024-01-01T10:00:00Z',
      cronSchedule: {
        minutes: '0',
        hours: '9',
        daysOfMonth: '*',
        months: '*',
        daysOfWeek: '1-5',
      },
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.firstRunAt).toBeUndefined();
    expect(result.cronSchedule).toBeUndefined();
  });

  it('should not include retry policy when enableRetryPolicy is false', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      enableRetryPolicy: false,
      retryPolicy: {
        initialIntervalSeconds: '10',
        backoffCoefficient: '2.0',
      },
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.retryPolicy).toBeUndefined();
  });

  it('should include retry policy when enableRetryPolicy is true', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      enableRetryPolicy: true,
      retryPolicy: {
        initialIntervalSeconds: '10',
        backoffCoefficient: '2.0',
        maximumIntervalSeconds: '100',
      },
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.retryPolicy).toBeDefined();
  });

  it('should include maximumAttempts when limitRetries is ATTEMPTS', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      enableRetryPolicy: true,
      limitRetries: 'ATTEMPTS',
      retryPolicy: {
        initialIntervalSeconds: '10',
        backoffCoefficient: '2.0',
        maximumAttempts: '5',
      },
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.retryPolicy).toEqual({
      initialIntervalSeconds: 10,
      backoffCoefficient: 2.0,
      maximumAttempts: 5,
    });
  });

  it('should include expirationIntervalSeconds when limitRetries is DURATION', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      enableRetryPolicy: true,
      limitRetries: 'DURATION',
      retryPolicy: {
        initialIntervalSeconds: '10',
        backoffCoefficient: '2.0',
        expirationIntervalSeconds: '3600',
      },
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.retryPolicy).toEqual({
      initialIntervalSeconds: 10,
      backoffCoefficient: 2.0,
      expirationIntervalSeconds: 3600,
    });
  });

  it('should handle empty retry policy', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      enableRetryPolicy: true,
      retryPolicy: {},
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.retryPolicy).toEqual({
      initialIntervalSeconds: undefined,
      backoffCoefficient: undefined,
      maximumIntervalSeconds: undefined,
    });
  });

  it('should parse and filter input array', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      input: ['{"key": "value"}', '{"number": 42}', ''],
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.input).toEqual([{ key: 'value' }, { number: 42 }]);
  });

  it('should handle empty input array', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      input: [],
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.input).toEqual([]);
  });

  it('should handle undefined input', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      input: undefined,
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.input).toEqual(undefined);
  });

  it('should handle empty string values in input array', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      input: ['', '{"valid": "json"}', ''],
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.input).toEqual([{ valid: 'json' }]);
  });

  it('should parse memo JSON', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      memo: '{"memoKey": "memoValue", "number": 123}',
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.memo).toEqual({
      memoKey: 'memoValue',
      number: 123,
    });
  });

  it('should handle undefined memo', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      memo: undefined,
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.memo).toBeUndefined();
  });

  it('should parse searchAttributes JSON', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      searchAttributes: [
        { key: 'attr1', value: 'value1' },
        { key: 'attr2', value: 456 },
      ],
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.searchAttributes).toEqual({
      attr1: 'value1',
      attr2: 456,
    });
  });

  it('should handle undefined searchAttributes', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      searchAttributes: undefined,
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.searchAttributes).toBeUndefined();
  });

  it('should parse header JSON', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      header: '{"header1": "value1", "header2": "value2"}',
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.header).toEqual({
      header1: 'value1',
      header2: 'value2',
    });
  });

  it('should handle undefined header', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      header: undefined,
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.header).toBeUndefined();
  });

  it('should convert string numbers to numbers in retry policy', () => {
    const baseRetryPolicy = {
      initialIntervalSeconds: '10',
      backoffCoefficient: '2.5',
      maximumIntervalSeconds: '100',
    };
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      enableRetryPolicy: true,
      limitRetries: 'ATTEMPTS',
      retryPolicy: {
        ...baseRetryPolicy,
        maximumAttempts: '3',
      },
    };

    const attemptsResult = transformStartWorkflowFormToSubmission(formData);

    expect(attemptsResult.retryPolicy).toEqual({
      initialIntervalSeconds: 10,
      backoffCoefficient: 2.5,
      maximumIntervalSeconds: 100,
      maximumAttempts: 3,
    });

    const durationResult = transformStartWorkflowFormToSubmission({
      ...formData,
      limitRetries: 'DURATION',
      retryPolicy: {
        ...baseRetryPolicy,
        expirationIntervalSeconds: '3600',
      },
    });

    expect(durationResult.retryPolicy).toEqual({
      initialIntervalSeconds: 10,
      backoffCoefficient: 2.5,
      maximumIntervalSeconds: 100,
      expirationIntervalSeconds: 3600,
    });
  });

  it('should handle decimal backoff coefficient', () => {
    const formData: StartWorkflowFormData = {
      ...baseFormData,
      enableRetryPolicy: true,
      retryPolicy: {
        initialIntervalSeconds: '1',
        backoffCoefficient: '1.5',
      },
    };

    const result = transformStartWorkflowFormToSubmission(formData);

    expect(result.retryPolicy?.backoffCoefficient).toBe(1.5);
  });
});
