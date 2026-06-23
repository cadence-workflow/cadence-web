import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { DEFAULT_OVERLAP_POLICY } from '@/views/domain-schedules/domain-schedules-create-advanced-form/domain-schedules-create-advanced-form.constants';

import { mockDomainSchedulesCreateFormData } from '../__fixtures__/mock-domain-schedules-create-form-data';
import transformDomainSchedulesCreateFormToBody from '../helpers/transform-domain-schedules-create-form-to-body';

describe(transformDomainSchedulesCreateFormToBody.name, () => {
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
    expect(result.catchUpWindowSeconds).toBe(14 * 24 * 60 * 60);
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
});
