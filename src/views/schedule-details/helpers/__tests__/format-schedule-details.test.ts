import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import { formatScheduleDetails } from '../format-schedule-details';

describe(formatScheduleDetails.name, () => {
  it('formats workflow input and memo fields in place', () => {
    const describeSchedule = getMockRunningDescribeScheduleResponse({
      action: {
        startWorkflow: {
          workflowType: { name: 'ScheduleWorker' },
          taskList: {
            name: 'schedule-task-list',
            kind: 'TASK_LIST_KIND_NORMAL',
            baseName: 'schedule-task-list',
          },
          input: {
            data: 'eyJ3b3JrZmxvd0FyZyI6InRlc3QtdmFsdWUifQ==',
          },
          workflowIdPrefix: 'schedule-prefix',
          executionStartToCloseTimeout: null,
          taskStartToCloseTimeout: null,
          retryPolicy: null,
          memo: {
            fields: {
              owner: { data: 'ImVuZy1sZWFkIg==' },
            },
          },
          searchAttributes: null,
        },
      },
      memo: {
        fields: {
          team: { data: 'ImNhZGVuY2Ui' },
          note: { data: 'dGVzdC1ub3Rl' },
        },
      },
    });

    const { memo: _scheduleMemo, ...scheduleWithoutMemo } = describeSchedule;

    expect(formatScheduleDetails(describeSchedule)).toEqual({
      ...scheduleWithoutMemo,
      action: {
        ...describeSchedule.action,
        startWorkflow: {
          ...describeSchedule.action!.startWorkflow!,
          input: [{ workflowArg: 'test-value' }],
          memo: { fields: { owner: 'eng-lead' } },
          taskList: {
            ...describeSchedule.action!.startWorkflow!.taskList!,
            kind: 'NORMAL',
          },
          retryPolicy: null,
        },
      },
    });
  });

  it('formats retry policy durations to seconds', () => {
    const describeSchedule = getMockRunningDescribeScheduleResponse({
      action: {
        startWorkflow: {
          workflowType: { name: 'ScheduleWorker' },
          taskList: null,
          input: null,
          workflowIdPrefix: '',
          executionStartToCloseTimeout: null,
          taskStartToCloseTimeout: null,
          retryPolicy: {
            initialInterval: { seconds: '10', nanos: 0 },
            backoffCoefficient: 2,
            maximumInterval: { seconds: '100', nanos: 0 },
            expirationInterval: { seconds: '1000', nanos: 0 },
            maximumAttempts: 3,
            nonRetryableErrorReasons: [],
          },
          memo: null,
          searchAttributes: null,
        },
      },
    });

    const { memo: _scheduleMemo, ...scheduleWithoutMemo } = describeSchedule;

    expect(formatScheduleDetails(describeSchedule)).toEqual({
      ...scheduleWithoutMemo,
      action: {
        ...describeSchedule.action,
        startWorkflow: {
          ...describeSchedule.action!.startWorkflow!,
          input: null,
          memo: null,
          taskList: null,
          retryPolicy: {
            initialIntervalInSeconds: 10,
            maximumIntervalInSeconds: 100,
            expirationIntervalInSeconds: 1000,
            backoffCoefficient: 2,
            maximumAttempts: 3,
            nonRetryableErrorReasons: [],
          },
        },
      },
    });
  });

  it('formats workflow search attributes with decoded indexed field values', () => {
    const describeSchedule = getMockRunningDescribeScheduleResponse({
      action: {
        startWorkflow: {
          workflowType: { name: 'ScheduleWorker' },
          taskList: null,
          input: null,
          workflowIdPrefix: '',
          executionStartToCloseTimeout: null,
          taskStartToCloseTimeout: null,
          retryPolicy: null,
          memo: null,
          searchAttributes: {
            indexedFields: {
              CustomStringField: { data: 'InNjaGVkdWxlLWRlbW8i' },
              CustomIntField: { data: 'NDI=' },
              CustomBoolField: { data: 'dHJ1ZQ==' },
            },
          },
        },
      },
    });

    const { memo: _scheduleMemo, ...scheduleWithoutMemo } = describeSchedule;

    expect(formatScheduleDetails(describeSchedule)).toEqual({
      ...scheduleWithoutMemo,
      action: {
        ...describeSchedule.action,
        startWorkflow: {
          ...describeSchedule.action!.startWorkflow!,
          input: null,
          memo: null,
          taskList: null,
          retryPolicy: null,
          searchAttributes: {
            indexedFields: {
              CustomStringField: 'schedule-demo',
              CustomIntField: 42,
              CustomBoolField: true,
            },
          },
        },
      },
    });
  });

  it('omits root memo when action is absent', () => {
    const describeSchedule = getMockRunningDescribeScheduleResponse();
    const { memo: _scheduleMemo, ...scheduleWithoutMemo } = describeSchedule;

    expect(formatScheduleDetails(describeSchedule)).toEqual({
      ...scheduleWithoutMemo,
      action: null,
    });
  });
});
