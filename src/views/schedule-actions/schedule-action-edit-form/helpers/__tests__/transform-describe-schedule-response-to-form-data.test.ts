import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { getMockDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

import {
  encodePayload,
  getMockEditableDescribeScheduleResponse,
  withStartWorkflow,
} from '../../__fixtures__/mock-editable-describe-schedule-response';
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

  it('leaves the cron fields empty for a non-UTC timezone', () => {
    expect(
      transform(
        getMockEditableDescribeScheduleResponse({
          spec: {
            cronExpression: 'CRON_TZ=America/New_York 30 9 1 * *',
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
        workflowIdPrefix: 'scheduled-demo-',
        workerSDKLanguage: undefined,
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
        catchUpWindowSeconds: '172800',
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

  it('prefills catch-up window as seconds', () => {
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
      ).catchUpWindowSeconds
    ).toEqual('90000');
  });

  it('prefills the retry policy and limits retries by attempts', () => {
    expect(transform()).toEqual(
      expect.objectContaining({
        enableRetryPolicy: true,
        limitRetries: 'ATTEMPTS',
        retryPolicy: {
          initialIntervalSeconds: '10',
          backoffCoefficient: '2',
          maximumIntervalSeconds: '600',
          maximumAttempts: '5',
          expirationIntervalSeconds: undefined,
        },
      })
    );
  });

  it('limits retries by duration when the policy has an expiration interval', () => {
    const formData = transform(
      withStartWorkflow({
        retryPolicy: {
          initialInterval: { seconds: '10', nanos: 0 },
          backoffCoefficient: 2,
          maximumInterval: null,
          maximumAttempts: 0,
          expirationInterval: { seconds: '3600', nanos: 0 },
          nonRetryableErrorReasons: [],
        },
      })
    );

    expect(formData.limitRetries).toEqual('DURATION');
    expect(formData.retryPolicy?.expirationIntervalSeconds).toEqual('3600');
    expect(formData.retryPolicy?.maximumAttempts).toBeUndefined();
  });

  it('decodes search attribute payloads into key/value pairs', () => {
    expect(transform().searchAttributes).toEqual([
      { key: 'CustomKeywordField', value: 'keyword' },
      { key: 'CustomIntField', value: 7 },
    ]);
  });

  it('prefills non-primitive search attribute values so validation rejects on submit', () => {
    expect(
      transform(
        withStartWorkflow({
          searchAttributes: {
            indexedFields: { CustomListField: encodePayload('["a","b"]') },
          },
        })
      ).searchAttributes
    ).toEqual([{ key: 'CustomListField', value: ['a', 'b'] }]);
  });

  it('decodes the memo into formatted JSON for the textarea', () => {
    expect(transform().memo).toEqual('{\n  "owner": "team-a"\n}');
  });

  it('leaves the memo unset when the schedule has none', () => {
    expect(transform(withStartWorkflow({ memo: null })).memo).toBeUndefined();
  });

  it('falls back to blank values for an empty schedule', () => {
    const formData = transform(getMockDescribeScheduleResponse());

    expect(formData).toEqual({
      scheduleId: MOCK_SCHEDULE_ID,
      cronExpression: EMPTY_CRON_EXPRESSION_FIELDS,
      workflowType: { name: '' },
      taskList: { name: '' },
      executionStartToCloseTimeoutSeconds: undefined,
      workerSDKLanguage: undefined,
      input: [''],
      workflowIdPrefix: undefined,
      pauseOnFailure: false,
      overlapPolicy: undefined,
      bufferLimit: undefined,
      concurrencyLimit: undefined,
      catchUpPolicy: undefined,
      catchUpWindowSeconds: undefined,
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
