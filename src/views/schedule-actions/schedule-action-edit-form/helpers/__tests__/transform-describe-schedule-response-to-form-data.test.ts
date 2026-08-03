import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { getMockDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import { getMockEditableDescribeScheduleResponse } from '../../__fixtures__/mock-editable-describe-schedule-response';
import { EMPTY_CRON_EXPRESSION_FIELDS } from '../../schedule-action-edit-form.constants';
import transformDescribeScheduleResponseToFormData from '../transform-describe-schedule-response-to-form-data';

const MOCK_SCHEDULE_ID = 'mock-schedule-id';

describe(transformDescribeScheduleResponseToFormData.name, () => {
  it('prefills the schedule id from the route rather than the response', () => {
    expect(transform().scheduleId).toEqual(MOCK_SCHEDULE_ID);
  });

  it('splits the cron expression into its five fields', () => {
    expect(transform().cronExpression).toEqual({
      minutes: '30',
      hours: '9',
      daysOfMonth: '1',
      months: '*',
      daysOfWeek: '*',
    });
  });

  it('leaves the cron fields empty for an expression it cannot split', () => {
    expect(
      transform(
        getMockEditableDescribeScheduleResponse({
          spec: {
            cronExpression: '@every 1h',
            startTime: null,
            endTime: null,
            jitter: null,
          },
        })
      ).cronExpression
    ).toEqual(EMPTY_CRON_EXPRESSION_FIELDS);
  });

  it('prefills the start workflow action fields', () => {
    const formData = transform();

    expect(formData).toEqual(
      expect.objectContaining({
        workflowType: { name: 'DemoWorkflow' },
        taskList: { name: 'demo-task-list' },
        executionStartToCloseTimeoutSeconds: 3600,
        taskStartToCloseTimeoutSeconds: 30,
        workflowIdPrefix: 'scheduled-demo-',
        workerSDKLanguage: 'GO',
      })
    );
  });

  it('splits a multi-argument workflow input back into separate entries', () => {
    expect(transform().input).toEqual(['{"a":1}', '{"b":2}']);
  });

  it('prefills the policy fields', () => {
    expect(transform()).toEqual(
      expect.objectContaining({
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ALL,
        catchUpWindowDays: '2',
        bufferLimit: '5',
        concurrencyLimit: '0',
        pauseOnFailure: true,
      })
    );
  });

  it('prefills the schedule period and jitter', () => {
    expect(transform()).toEqual(
      expect.objectContaining({
        startTime: '2026-01-01T00:00:00.000Z',
        endTime: '2026-01-02T00:00:00.000Z',
        jitterSeconds: '90',
      })
    );
  });

  it('rounds a partial catch-up window day up, so the window is never narrowed', () => {
    expect(
      transform(
        getMockEditableDescribeScheduleResponse({
          policies: {
            overlapPolicy:
              ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT,
            catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE,
            catchUpWindow: { seconds: '90000', nanos: 0 },
            pauseOnFailure: false,
            bufferLimit: 0,
            concurrencyLimit: 0,
          },
        })
      ).catchUpWindowDays
    ).toEqual('2');
  });

  it('falls back to blank values for an empty schedule', () => {
    const formData = transform(getMockDescribeScheduleResponse());

    expect(formData).toEqual({
      scheduleId: MOCK_SCHEDULE_ID,
      cronExpression: EMPTY_CRON_EXPRESSION_FIELDS,
      workflowType: { name: '' },
      taskList: { name: '' },
      executionStartToCloseTimeoutSeconds: 0,
      taskStartToCloseTimeoutSeconds: 0,
      workerSDKLanguage: 'GO',
      input: [''],
      workflowIdPrefix: undefined,
      pauseOnFailure: false,
      overlapPolicy: undefined,
      bufferLimit: undefined,
      concurrencyLimit: undefined,
      catchUpPolicy: undefined,
      catchUpWindowDays: undefined,
      jitterSeconds: undefined,
      startTime: undefined,
      endTime: undefined,
      enableRetryPolicy: false,
      limitRetries: undefined,
      retryPolicy: undefined,
      searchAttributes: undefined,
      memo: undefined,
    });
  });
});

function transform(
  schedule: DescribeScheduleResponse = getMockEditableDescribeScheduleResponse()
) {
  return transformDescribeScheduleResponseToFormData(
    schedule,
    MOCK_SCHEDULE_ID
  );
}
