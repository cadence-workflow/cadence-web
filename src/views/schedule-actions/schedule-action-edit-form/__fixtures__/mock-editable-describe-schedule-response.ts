import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { getMockDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { type DescribeScheduleResponse } from '@/route-handlers/describe-schedule/describe-schedule.types';

function encodePayload(json: string) {
  return { data: Buffer.from(json, 'utf-8').toString('base64') };
}

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
        input: encodePayload('{"a":1} {"b":2}'),
        workflowIdPrefix: 'scheduled-demo-',
        executionStartToCloseTimeout: { seconds: '3600', nanos: 0 },
        taskStartToCloseTimeout: { seconds: '30', nanos: 0 },
        retryPolicy: {
          initialInterval: { seconds: '10', nanos: 0 },
          backoffCoefficient: 2,
          maximumInterval: { seconds: '600', nanos: 0 },
          maximumAttempts: 5,
          expirationInterval: null,
          nonRetryableErrorReasons: [],
        },
        memo: { fields: { owner: encodePayload('"team-a"') } },
        searchAttributes: {
          indexedFields: {
            CustomKeywordField: encodePayload('"keyword"'),
            CustomIntField: encodePayload('7'),
          },
        },
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

type EditableStartWorkflow = NonNullable<
  NonNullable<DescribeScheduleResponse['action']>['startWorkflow']
>;

/** Overrides fields on the editable mock's start-workflow action, keeping the rest. */
export function withStartWorkflow(
  startWorkflowOverrides: Partial<EditableStartWorkflow> = {}
): DescribeScheduleResponse {
  const mock = getMockEditableDescribeScheduleResponse();
  const startWorkflow = mock.action?.startWorkflow;

  if (!startWorkflow) {
    throw new Error('mock is missing a start workflow action');
  }

  return getMockEditableDescribeScheduleResponse({
    action: { startWorkflow: { ...startWorkflow, ...startWorkflowOverrides } },
  });
}
