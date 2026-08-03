import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { getMockDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

/** A fully-populated schedule, used to check that every form field prefills. */
export function getMockEditableDescribeScheduleResponse(
  overrides: Partial<DescribeScheduleResponse> = {}
): DescribeScheduleResponse {
  return getMockDescribeScheduleResponse({
    spec: {
      cronExpression: '30 9 1 * *',
      startTime: { seconds: '1767225600', nanos: 0 },
      endTime: { seconds: '1767312000', nanos: 0 },
      jitter: { seconds: '90', nanos: 0 },
    },
    action: {
      startWorkflow: {
        workflowType: { name: 'DemoWorkflow' },
        taskList: {
          name: 'demo-task-list',
          kind: 'TASK_LIST_KIND_NORMAL',
          baseName: 'demo-task-list',
        },
        input: {
          data: Buffer.from('{"a":1} {"b":2}', 'utf-8').toString('base64'),
        },
        workflowIdPrefix: 'scheduled-demo-',
        executionStartToCloseTimeout: { seconds: '3600', nanos: 0 },
        taskStartToCloseTimeout: { seconds: '30', nanos: 0 },
        retryPolicy: null,
        memo: null,
        searchAttributes: null,
      },
    },
    policies: {
      overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
      catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ALL,
      catchUpWindow: { seconds: '172800', nanos: 0 },
      pauseOnFailure: true,
      bufferLimit: 5,
      concurrencyLimit: 0,
    },
    ...overrides,
  });
}
