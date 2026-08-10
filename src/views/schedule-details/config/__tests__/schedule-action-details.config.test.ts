import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';

import scheduleActionDetailsConfig from '../schedule-action-details.config';
import { formatScheduleDetails } from '../../helpers/format-schedule-details';
import { getRowsFromConfig } from '../../helpers/get-rows-from-config';

describe('scheduleActionDetailsConfig', () => {
  const scheduleId = 'my-schedule';
  const domain = 'test-domain';
  const cluster = 'test-cluster';

  it('hides task start to close timeout when the schedule has no value', () => {
    const formattedScheduleDetails = formatScheduleDetails(
      getMockRunningDescribeScheduleResponse({
        action: {
          startWorkflow: {
            workflowType: { name: 'DemoWorkflow' },
            taskList: {
              name: 'demo-tl',
              kind: 'TASK_LIST_KIND_NORMAL',
              baseName: 'demo-tl',
            },
            executionStartToCloseTimeout: { seconds: 3600, nanos: 0 },
            taskStartToCloseTimeout: null,
            workflowIdPrefix: '',
            input: null,
            retryPolicy: null,
            memo: null,
            searchAttributes: null,
          },
        },
      })
    );

    const rows = getRowsFromConfig(
      scheduleActionDetailsConfig,
      formattedScheduleDetails,
      scheduleId,
      domain,
      cluster
    );

    expect(
      rows.some((row) => row.key === 'taskStartToCloseTimeout')
    ).toBe(false);
    expect(
      rows.some((row) => row.key === 'executionStartToCloseTimeout')
    ).toBe(true);
  });

  it('shows task start to close timeout when the schedule has a value', () => {
    const formattedScheduleDetails = formatScheduleDetails(
      getMockRunningDescribeScheduleResponse({
        action: {
          startWorkflow: {
            workflowType: { name: 'DemoWorkflow' },
            taskList: {
              name: 'demo-tl',
              kind: 'TASK_LIST_KIND_NORMAL',
              baseName: 'demo-tl',
            },
            executionStartToCloseTimeout: { seconds: 3600, nanos: 0 },
            taskStartToCloseTimeout: { seconds: 30, nanos: 0 },
            workflowIdPrefix: '',
            input: null,
            retryPolicy: null,
            memo: null,
            searchAttributes: null,
          },
        },
      })
    );

    const rows = getRowsFromConfig(
      scheduleActionDetailsConfig,
      formattedScheduleDetails,
      scheduleId,
      domain,
      cluster
    );

    expect(
      rows.find((row) => row.key === 'taskStartToCloseTimeout')
    ).toEqual({
      key: 'taskStartToCloseTimeout',
      label: 'Task start to close timeout',
      value: '30s',
    });
  });
});
