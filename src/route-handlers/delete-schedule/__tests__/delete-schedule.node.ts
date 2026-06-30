import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { deleteSchedule } from '../delete-schedule';
import { type Context } from '../delete-schedule.types';

describe(deleteSchedule.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls deleteSchedule and returns valid response', async () => {
    const { res, mockDeleteSchedule } = await setup({});

    expect(mockDeleteSchedule).toHaveBeenCalledWith({
      domain: 'mock-domain',
      scheduleId: 'mock-schedule-id',
    });

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({});
  });

  it('accepts an empty request body', async () => {
    const { res, mockDeleteSchedule } = await setup({
      requestBody: JSON.stringify({}),
    });

    expect(mockDeleteSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(200);
  });

  it('returns an error if deleteSchedule throws a GRPCError (not found)', async () => {
    const { res, mockDeleteSchedule } = await setup({
      error: new GRPCError('Schedule not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockDeleteSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(404);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Schedule not found',
      })
    );
  });

  it('returns an error if deleteSchedule throws a GRPCError (conflict)', async () => {
    const { res, mockDeleteSchedule } = await setup({
      error: new GRPCError('Schedule is busy', {
        grpcStatusCode: status.FAILED_PRECONDITION,
      }),
    });

    expect(mockDeleteSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Schedule is busy',
      })
    );
  });

  it('returns an error if deleteSchedule throws a generic error', async () => {
    const { res, mockDeleteSchedule } = await setup({
      error: new Error('Unexpected failure'),
    });

    expect(mockDeleteSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Error deleting schedule',
      })
    );
  });

  it('treats malformed JSON body as empty object', async () => {
    const { res, mockDeleteSchedule } = await setup({
      requestBody: 'not-json',
    });

    expect(mockDeleteSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(200);
  });
});

async function setup({
  requestBody = null,
  scheduleId = 'mock-schedule-id',
  error,
}: {
  requestBody?: string | null;
  scheduleId?: string;
  error?: Error;
}) {
  const mockDeleteSchedule = jest
    .spyOn(mockGrpcClusterMethods, 'deleteSchedule')
    .mockImplementation(async () => {
      if (error) {
        throw error;
      }
      return {};
    });

  const res = await deleteSchedule(
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

  return { res, mockDeleteSchedule };
}
