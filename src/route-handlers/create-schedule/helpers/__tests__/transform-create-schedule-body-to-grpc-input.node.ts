import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';

import { type CreateScheduleRequestBody } from '../../create-schedule.types';
import transformCreateScheduleBodyToGrpcInput from '../transform-create-schedule-body-to-grpc-input';

function minimalStartWorkflow(
  overrides: Partial<CreateScheduleRequestBody['startWorkflow']> = {}
): CreateScheduleRequestBody['startWorkflow'] {
  return {
    workflowType: { name: 'DemoWorkflow' },
    taskList: { name: 'demo-task-list' },
    workerSDKLanguage: 'GO',
    workflowIdPrefix: 'scheduled-demo-',
    executionStartToCloseTimeoutSeconds: 3600,
    taskStartToCloseTimeoutSeconds: 30,
    ...overrides,
  };
}

function minimalBody(
  overrides: Partial<CreateScheduleRequestBody> = {}
): CreateScheduleRequestBody {
  return {
    scheduleId: 'my-schedule',
    cronExpression: '0 9 * * *',
    startWorkflow: minimalStartWorkflow(),
    ...overrides,
  };
}

describe(transformCreateScheduleBodyToGrpcInput.name, () => {
  it('maps domain, identity, cron spec, and start-workflow action fields', () => {
    const grpc = transformCreateScheduleBodyToGrpcInput({
      domain: 'test-domain',
      body: minimalBody(),
    });

    expect(grpc.domain).toBe('test-domain');
    expect(grpc.scheduleId).toBe('my-schedule');
    expect(grpc.spec).toEqual({
      cronExpression: '0 9 * * *',
      startTime: undefined,
      endTime: undefined,
      jitter: undefined,
    });
    expect(grpc.action?.startWorkflow).toEqual(
      expect.objectContaining({
        workflowType: { name: 'DemoWorkflow' },
        taskList: { name: 'demo-task-list' },
        workflowIdPrefix: 'scheduled-demo-',
        executionStartToCloseTimeout: { seconds: 3600, nanos: 0 },
        taskStartToCloseTimeout: { seconds: 30, nanos: 0 },
        retryPolicy: undefined,
        memo: undefined,
        searchAttributes: undefined,
        input: undefined,
      })
    );
  });

  it('maps ISO schedule bounds and jitter to spec timestamps and duration', () => {
    const grpc = transformCreateScheduleBodyToGrpcInput({
      domain: 'd',
      body: minimalBody({
        startTime: '2024-04-02T22:15:00.000Z',
        endTime: '2024-04-02T22:15:00.500Z',
        jitterSeconds: 12,
      }),
    });

    expect(grpc.spec).toEqual({
      cronExpression: '0 9 * * *',
      startTime: { seconds: 1_712_096_100, nanos: 0 },
      endTime: { seconds: 1_712_096_100, nanos: 500_000_000 },
      jitter: { seconds: 12, nanos: 0 },
    });
  });

  it('maps fractional jitter seconds to duration nanos', () => {
    const grpc = transformCreateScheduleBodyToGrpcInput({
      domain: 'd',
      body: minimalBody({ jitterSeconds: 1.5 }),
    });

    expect(grpc.spec?.jitter).toEqual({ seconds: 1, nanos: 500_000_000 });
  });

  it('omits zero jitter seconds', () => {
    const grpc = transformCreateScheduleBodyToGrpcInput({
      domain: 'd',
      body: minimalBody({ jitterSeconds: 0 }),
    });

    expect(grpc.spec?.jitter).toBeUndefined();
  });

  it('maps schedule policies', () => {
    const grpc = transformCreateScheduleBodyToGrpcInput({
      domain: 'd',
      body: minimalBody({
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE,
        catchUpWindowSeconds: 90,
        pauseOnFailure: true,
        bufferLimit: 3,
        concurrencyLimit: 2,
      }),
    });

    expect(grpc.policies).toEqual({
      overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
      catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_ONE,
      catchUpWindow: { seconds: 90, nanos: 0 },
      pauseOnFailure: true,
      bufferLimit: 3,
      concurrencyLimit: 2,
    });
  });

  it('omits gRPC retry policy when the body retry policy is an empty object', () => {
    const grpc = transformCreateScheduleBodyToGrpcInput({
      domain: 'd',
      body: minimalBody({
        startWorkflow: minimalStartWorkflow({ retryPolicy: {} }),
      }),
    });

    expect(grpc.action?.startWorkflow?.retryPolicy).toBeUndefined();
  });

  it('serializes workflow input, memo, and search attributes for the gRPC action', () => {
    const grpc = transformCreateScheduleBodyToGrpcInput({
      domain: 'd',
      body: minimalBody({
        startWorkflow: minimalStartWorkflow({
          workerSDKLanguage: 'JAVA',
          input: [{ id: 1 }],
          memo: { team: 'cadence' },
          searchAttributes: { env: 'test', n: 1, ok: true },
          retryPolicy: { initialIntervalSeconds: 1, maximumAttempts: 3 },
        }),
      }),
    });

    const sw = grpc.action?.startWorkflow;
    expect(sw?.input).toEqual({
      data: Buffer.from('{"id":1}', 'utf-8'),
    });
    expect(sw?.memo?.fields?.team).toEqual({
      data: Buffer.from(JSON.stringify('cadence'), 'utf-8'),
    });
    expect(sw?.searchAttributes?.indexedFields?.env).toEqual({
      data: Buffer.from(JSON.stringify('test'), 'utf-8'),
    });
    expect(sw?.searchAttributes?.indexedFields?.n).toEqual({
      data: Buffer.from(JSON.stringify(1), 'utf-8'),
    });
    expect(sw?.searchAttributes?.indexedFields?.ok).toEqual({
      data: Buffer.from(JSON.stringify(true), 'utf-8'),
    });
    expect(sw?.retryPolicy).toEqual({
      initialInterval: { seconds: 1, nanos: 0 },
      backoffCoefficient: undefined,
      maximumInterval: undefined,
      expirationInterval: undefined,
      maximumAttempts: 3,
    });
  });
});
