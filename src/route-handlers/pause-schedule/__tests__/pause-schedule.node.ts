import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { pauseSchedule } from '../pause-schedule';
import { type Context } from '../pause-schedule.types';

describe(pauseSchedule.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls pauseSchedule and returns valid response', async () => {
    const { res, mockPauseSchedule } = await setup({});

    expect(mockPauseSchedule).toHaveBeenCalledWith({
      domain: 'mock-domain',
      scheduleId: 'mock-schedule-id',
      reason: undefined,
      identity: undefined,
    });

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({});
  });

  it('returns valid response when request has no body', async () => {
    const { res, mockPauseSchedule } = await setup({
      requestBody: null,
    });

    expect(mockPauseSchedule).toHaveBeenCalledWith({
      domain: 'mock-domain',
      scheduleId: 'mock-schedule-id',
      reason: undefined,
      identity: undefined,
    });
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({});
  });

  it('returns valid response when request body is malformed JSON', async () => {
    const { res, mockPauseSchedule } = await setup({
      requestBody: 'not-json',
    });

    expect(mockPauseSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({});
  });

  it('calls pauseSchedule with optional reason in request body', async () => {
    const { mockPauseSchedule } = await setup({
      requestBody: JSON.stringify({ reason: 'Maintenance window' }),
    });

    expect(mockPauseSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'Maintenance window',
      })
    );
  });

  it('returns an error if pauseSchedule throws a GRPCError', async () => {
    const { res, mockPauseSchedule } = await setup({
      error: new GRPCError('Schedule not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockPauseSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(404);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Schedule not found',
      })
    );
  });

  it('returns an error if the request body is not in an expected format', async () => {
    const { res, mockPauseSchedule } = await setup({
      requestBody: JSON.stringify({ reason: 123 }),
    });

    expect(mockPauseSchedule).not.toHaveBeenCalled();
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for schedule pause',
      })
    );
  });
});

async function setup({
  requestBody = '{}',
  scheduleId = 'mock-schedule-id',
  error,
}: {
  requestBody?: string | null;
  scheduleId?: string;
  error?: GRPCError;
}) {
  const mockPauseSchedule = jest
    .spyOn(mockGrpcClusterMethods, 'pauseSchedule')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return {};
    });

  const res = await pauseSchedule(
    new NextRequest('http://localhost', {
      method: 'POST',
      ...(requestBody === null ? {} : { body: requestBody }),
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

  return { res, mockPauseSchedule };
}
