import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import { formatScheduleDetails } from '../format-schedule-details';

describe(formatScheduleDetails.name, () => {
  it('formats workflow input and memo fields in place', () => {
    const describeSchedule = getMockRunningDescribeScheduleResponse({
      action: {
        startWorkflow: {
          workflowType: { name: 'ScheduleWorker' },
          taskList: null,
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
    });

    const result = formatScheduleDetails(describeSchedule);

    expect(result.action?.startWorkflow?.input).toEqual([
      { workflowArg: 'test-value' },
    ]);
    expect(result.action?.startWorkflow?.memo).toEqual({
      fields: { owner: 'eng-lead' },
    });
  });

  it('formats task list kind enum', () => {
    const describeSchedule = getMockRunningDescribeScheduleResponse({
      action: {
        startWorkflow: {
          workflowType: { name: 'ScheduleWorker' },
          taskList: {
            name: 'schedule-task-list',
            kind: 'TASK_LIST_KIND_NORMAL',
            baseName: 'schedule-task-list',
          },
          input: null,
          workflowIdPrefix: '',
          executionStartToCloseTimeout: null,
          taskStartToCloseTimeout: null,
          retryPolicy: null,
          memo: null,
          searchAttributes: null,
        },
      },
    });

    expect(
      formatScheduleDetails(describeSchedule).action?.startWorkflow?.taskList
    ).toEqual({
      name: 'schedule-task-list',
      baseName: 'schedule-task-list',
      kind: 'NORMAL',
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

    expect(
      formatScheduleDetails(describeSchedule).action?.startWorkflow?.retryPolicy
    ).toEqual({
      initialIntervalInSeconds: 10,
      maximumIntervalInSeconds: 100,
      expirationIntervalInSeconds: 1000,
      backoffCoefficient: 2,
      maximumAttempts: 3,
      nonRetryableErrorReasons: [],
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

    expect(
      formatScheduleDetails(describeSchedule).action?.startWorkflow
        ?.searchAttributes
    ).toEqual({
      indexedFields: {
        CustomStringField: 'schedule-demo',
        CustomIntField: 42,
        CustomBoolField: true,
      },
    });
  });
});
