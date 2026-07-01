import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import { formatScheduleDetails } from '../format-schedule-details';

describe(formatScheduleDetails.name, () => {
  it('formats workflow memo fields in place', () => {
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
          memo: { fields: { owner: 'eng-lead' } },
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
