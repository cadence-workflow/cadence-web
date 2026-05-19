import { status } from '@grpc/grpc-js';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { createSchedule } from '../create-schedule';
import { type Context, type RequestParams } from '../create-schedule.types';

jest.mock('@/utils/logger');

const validScheduleCreateFields = {
  cronExpression: '0 9 * * *',
  startWorkflow: {
    workflowType: { name: 'DemoWorkflow' },
    taskList: { name: 'demo-task-list' },
    workerSDKLanguage: 'GO' as const,
    workflowIdPrefix: 'scheduled-demo-',
    executionStartToCloseTimeoutSeconds: 3600,
    taskStartToCloseTimeoutSeconds: 30,
  },
};

function getValidRequestBody() {
  return {
    scheduleId: 'my-schedule',
    ...validScheduleCreateFields,
  };
}

function getValidRequestBodyWithoutScheduleId() {
  return { ...validScheduleCreateFields };
}

describe(createSchedule.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls createSchedule and returns the gRPC response', async () => {
    const { res, mockCreateSchedule } = await setup({});

    expect(mockCreateSchedule).toHaveBeenCalledTimes(1);
    expect(res.status).toEqual(200);
    const json = await res.json();
    expect(json).toEqual({ scheduleId: 'my-schedule' });
  });

  it('generates scheduleId when omitted', async () => {
    const generated = 'aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee';
    const randomSpy = jest.spyOn(crypto, 'randomUUID').mockReturnValue(generated);

    try {
      const { mockCreateSchedule } = await setup({
        body: getValidRequestBodyWithoutScheduleId(),
      });

      expect(mockCreateSchedule).toHaveBeenCalledWith(
        expect.objectContaining({ scheduleId: generated })
      );
    } finally {
      randomSpy.mockRestore();
    }
  });

  it('accepts buffer limit 0 when overlap policy is buffer', async () => {
    const { res, mockCreateSchedule } = await setup({
      body: {
        ...getValidRequestBody(),
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        bufferLimit: 0,
      },
    });

    expect(mockCreateSchedule).toHaveBeenCalledTimes(1);
    expect(res.status).toEqual(200);
  });

  it('accepts concurrency limit 0 when overlap policy is concurrent', async () => {
    const { res, mockCreateSchedule } = await setup({
      body: {
        ...getValidRequestBody(),
        overlapPolicy:
          ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_CONCURRENT,
        concurrencyLimit: 0,
      },
    });

    expect(mockCreateSchedule).toHaveBeenCalledTimes(1);
    expect(res.status).toEqual(200);
  });

  it('returns validation error when body is invalid', async () => {
    const { res, mockCreateSchedule } = await setup({
      body: { scheduleId: '' },
    });

    expect(mockCreateSchedule).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    const json = await res.json();
    expect(json.message).toEqual('Invalid values provided for schedule create');
    expect(Array.isArray(json.validationErrors)).toBe(true);
  });

  it('returns error when createSchedule throws a GRPCError', async () => {
    const { res, mockCreateSchedule } = await setup({
      error: new GRPCError('Schedule already exists', {
        grpcStatusCode: status.ALREADY_EXISTS,
      }),
    });

    expect(mockCreateSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(409);
    const json = await res.json();
    expect(json).toEqual(
      expect.objectContaining({
        message: 'Schedule already exists',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        error: expect.any(GRPCError),
      }),
      'Error creating schedule: Schedule already exists'
    );
  });

  it('returns error when createSchedule throws a generic error', async () => {
    const { res, mockCreateSchedule } = await setup({
      error: new Error('Network error'),
    });

    expect(mockCreateSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(500);
    const json = await res.json();
    expect(json).toEqual(
      expect.objectContaining({
        message: 'Error creating schedule',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        error: expect.any(Error),
      }),
      'Error creating schedule'
    );
  });
});

async function setup({ body, error }: { body?: unknown; error?: Error }) {
  const mockCreateSchedule = jest
    .spyOn(mockGrpcClusterMethods, 'createSchedule')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return { scheduleId: 'my-schedule' };
    });

  const payload = body ?? getValidRequestBody();

  const res = await createSchedule(
    new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
      },
    } as RequestParams,
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockCreateSchedule };
}
