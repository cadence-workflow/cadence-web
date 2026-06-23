import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { DEFAULT_OVERLAP_POLICY } from '@/views/domain-schedules/domain-schedules-create-advanced-form/domain-schedules-create-advanced-form.constants';

import { mockDomainSchedulesCreateFormData } from '../__fixtures__/mock-domain-schedules-create-form-data';
import { type DomainSchedulesCreateFormData } from '../domain-schedules-create-modal.types';
import transformDomainSchedulesCreateFormToBody from '../helpers/transform-domain-schedules-create-form-to-body';

describe(transformDomainSchedulesCreateFormToBody.name, () => {
  const baseForm: DomainSchedulesCreateFormData = {
    cronExpression: {
      minutes: '0',
      hours: '9',
      daysOfMonth: '*',
      months: '*',
      daysOfWeek: '*',
    },
    workflowType: { name: 'DemoWorkflow' },
    taskList: { name: 'demo-tl' },
    workerSDKLanguage: 'GO',
    executionStartToCloseTimeoutSeconds: 3600,
    taskStartToCloseTimeoutSeconds: 45,
    pauseOnFailure: false,
    overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_SKIP_NEW,
    catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP,
    enableRetryPolicy: false,
    limitRetries: 'ATTEMPTS',
  };

  it('maps form fields to create-schedule request body', () => {
    const result = transformDomainSchedulesCreateFormToBody(
      mockDomainSchedulesCreateFormData
    );

    expect(result).toEqual({
      cronExpression: '0 9 * * *',
      startWorkflow: {
        workflowType: { name: 'DemoWorkflow' },
        taskList: { name: 'demo-tl' },
        workerSDKLanguage: 'GO',
        executionStartToCloseTimeoutSeconds: 3600,
        taskStartToCloseTimeoutSeconds: 45,
      },
    });
  });

  it('includes parsed JSON inputs when provided', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      input: ['"a"', '42'],
    });

    expect(result.startWorkflow.input).toEqual(['a', 42]);
  });

  it('omits input when only empty strings are present', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      input: ['', '  '],
    });

    expect(result.startWorkflow.input).toBeUndefined();
  });

  it('trims text fields', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      workflowType: { name: ' DemoWorkflow ' },
      taskList: { name: ' demo-tl ' },
      scheduleId: '  my-schedule  ',
      workflowIdPrefix: '  wf-prefix  ',
    });

    expect(result.startWorkflow.workflowType.name).toBe('DemoWorkflow');
    expect(result.startWorkflow.taskList.name).toBe('demo-tl');
    expect(result.scheduleId).toBe('my-schedule');
    expect(result.startWorkflow.workflowIdPrefix).toBe('wf-prefix');
  });

  it('passes 0 seconds as jitter', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      jitterSeconds: '0',
    });

    expect(result.jitterSeconds).toBe(0);
  });

  it('maps optional simple advanced fields only when provided', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      scheduleId: '  my-schedule  ',
      workflowIdPrefix: '  wf-prefix  ',
      jitterSeconds: '10',
    });

    expect(result.scheduleId).toBe('my-schedule');
    expect(result.jitterSeconds).toBe(10);
    expect(result.startWorkflow.workflowIdPrefix).toBe('wf-prefix');
  });

  it('includes bufferLimit only for buffer overlap policy', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
      bufferLimit: '4',
      concurrencyLimit: '9',
    });

    expect(result.overlapPolicy).toBe(
      ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER
    );
    expect(result.bufferLimit).toBe(4);
    expect(result.concurrencyLimit).toBeUndefined();
  });

  it('includes concurrencyLimit only for concurrent overlap policy', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      overlapPolicy: DEFAULT_OVERLAP_POLICY,
      bufferLimit: '2',
      concurrencyLimit: '7',
    });

    expect(result.overlapPolicy).toBe(DEFAULT_OVERLAP_POLICY);
    expect(result.concurrencyLimit).toBe(7);
    expect(result.bufferLimit).toBeUndefined();
  });

  it('maps catch-up window days to seconds for non-skip catch-up policy', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE,
      catchUpWindowDays: '14',
    });

    expect(result.catchUpPolicy).toBe(
      ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE
    );
    expect(result.catchUpWindowSeconds).toBe(14 * 86400);
  });

  it('omits catch-up window seconds for skip catch-up policy', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP,
      catchUpWindowDays: '14',
    });

    expect(result.catchUpPolicy).toBe(
      ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP
    );
    expect(result.catchUpWindowSeconds).toBeUndefined();
  });

  it('omits catchUpPolicy when not set on form data', () => {
    const result = transformDomainSchedulesCreateFormToBody(
      mockDomainSchedulesCreateFormData
    );

    expect(result.catchUpPolicy).toBeUndefined();
  });

  it('omits buffer and concurrency limits when limit strings are empty', () => {
    const bufferResult = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
      bufferLimit: '',
    });
    expect(bufferResult.bufferLimit).toBeUndefined();

    const concurrentResult = transformDomainSchedulesCreateFormToBody({
      ...mockDomainSchedulesCreateFormData,
      overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT,
      concurrencyLimit: '',
    });
    expect(concurrentResult.concurrencyLimit).toBeUndefined();
  });

  it('includes schedule period fields when provided', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...baseForm,
      startTime: '2026-06-23T12:00:00.000Z',
      endTime: '2026-06-30T12:00:00.000Z',
    });

    expect(result.startTime).toBe('2026-06-23T12:00:00.000Z');
    expect(result.endTime).toBe('2026-06-30T12:00:00.000Z');
  });

  it('omits schedule period fields when not provided', () => {
    const result = transformDomainSchedulesCreateFormToBody(baseForm);

    expect(result.startTime).toBeUndefined();
    expect(result.endTime).toBeUndefined();
  });

  it('maps memo JSON and search attributes into startWorkflow', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...baseForm,
      memo: '{"k":"v"}',
      searchAttributes: [
        { key: 'CustomKeywordField', value: 'value-1' },
        { key: 'CustomIntField', value: 9 },
      ],
    });

    expect(result.startWorkflow.memo).toEqual({ k: 'v' });
    expect(result.startWorkflow.searchAttributes).toEqual({
      CustomKeywordField: 'value-1',
      CustomIntField: 9,
    });
  });

  it('omits memo and search attributes when empty', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...baseForm,
      memo: '  ',
      searchAttributes: [],
    });

    expect(result.startWorkflow.memo).toBeUndefined();
    expect(result.startWorkflow.searchAttributes).toBeUndefined();
  });

  it('maps retry policy with attempts limit when enabled', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...baseForm,
      enableRetryPolicy: true,
      limitRetries: 'ATTEMPTS',
      retryPolicy: {
        initialIntervalSeconds: 1,
        backoffCoefficient: 2,
        maximumIntervalSeconds: 10,
        maximumAttempts: 5,
      },
    });

    expect(result.startWorkflow.retryPolicy).toEqual({
      initialIntervalSeconds: 1,
      backoffCoefficient: 2,
      maximumIntervalSeconds: 10,
      maximumAttempts: 5,
    });
  });

  it('maps retry policy with duration limit when enabled', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...baseForm,
      enableRetryPolicy: true,
      limitRetries: 'DURATION',
      retryPolicy: {
        initialIntervalSeconds: 1,
        backoffCoefficient: 2,
        expirationIntervalSeconds: 60,
      },
    });

    expect(result.startWorkflow.retryPolicy).toEqual({
      initialIntervalSeconds: 1,
      backoffCoefficient: 2,
      expirationIntervalSeconds: 60,
    });
  });

  it('omits retry policy when disabled', () => {
    const result = transformDomainSchedulesCreateFormToBody({
      ...baseForm,
      enableRetryPolicy: false,
      limitRetries: 'ATTEMPTS',
      retryPolicy: {
        initialIntervalSeconds: 1,
        backoffCoefficient: 2,
        maximumAttempts: 5,
      },
    });

    expect(result.startWorkflow.retryPolicy).toBeUndefined();
  });
});
