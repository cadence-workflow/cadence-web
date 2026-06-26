import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { ScheduleCatchUpPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleCatchUpPolicy';
import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { unpauseSchedule } from '../unpause-schedule';
import { type Context } from '../unpause-schedule.types';

describe(unpauseSchedule.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls unpauseSchedule and returns valid response', async () => {
    const { res, mockUnpauseSchedule } = await setup({});

    expect(mockUnpauseSchedule).toHaveBeenCalledWith({
      domain: 'mock-domain',
      scheduleId: 'mock-schedule-id',
      reason: undefined,
      catchUpPolicy: undefined,
    });

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({});
  });

  it('calls unpauseSchedule with optional request body fields', async () => {
    const { mockUnpauseSchedule } = await setup({
      requestBody: JSON.stringify({
        reason: 'Maintenance complete',
        catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP,
      }),
    });

    expect(mockUnpauseSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'Maintenance complete',
        catchUpPolicy: ScheduleCatchUpPolicy.SCHEDULE_CATCH_UP_POLICY_SKIP,
      })
    );
  });

  it('returns an error if unpauseSchedule throws a GRPCError', async () => {
    const { res, mockUnpauseSchedule } = await setup({
      error: new GRPCError('Schedule not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockUnpauseSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(404);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Schedule not found',
      })
    );
  });

  it('returns an error if the request body is not in an expected format', async () => {
    const { res, mockUnpauseSchedule } = await setup({
      requestBody: JSON.stringify({ reason: 123 }),
    });

    expect(mockUnpauseSchedule).not.toHaveBeenCalled();
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for schedule unpause',
      })
    );
  });

  it('returns an error if scheduleId is missing from route params', async () => {
    const { res, mockUnpauseSchedule } = await setup({
      scheduleId: '',
    });

    expect(mockUnpauseSchedule).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Missing scheduleId in route params',
      })
    );
  });
});

async function setup({
  requestBody = '{}',
  scheduleId = 'mock-schedule-id',
  error,
}: {
  requestBody?: string;
  scheduleId?: string;
  error?: GRPCError;
}) {
  const mockUnpauseSchedule = jest
    .spyOn(mockGrpcClusterMethods, 'unpauseSchedule')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return {};
    });

  const res = await unpauseSchedule(
    new NextRequest('http://localhost', {
      method: 'POST',
      body: requestBody,
    }),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        scheduleId,
      },
    },
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockUnpauseSchedule };
}
