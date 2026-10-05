import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { ScheduleOverlapPolicy } from '@/__generated__/proto-ts/uber/cadence/api/v1/ScheduleOverlapPolicy';
import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { backfillSchedule } from '../backfill-schedule';
import { type Context } from '../backfill-schedule.types';

const defaultRequestBody = {
  startTime: '2026-01-01T00:00:00.000Z',
  endTime: '2026-01-02T00:00:00.000Z',
};

describe(backfillSchedule.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls backfillSchedule and returns valid response', async () => {
    const { res, mockBackfillSchedule } = await setup({});

    expect(mockBackfillSchedule).toHaveBeenCalledWith({
      domain: 'mock-domain',
      scheduleId: 'mock-schedule-id',
      startTime: { seconds: 1_767_225_600, nanos: 0 },
      endTime: { seconds: 1_767_312_000, nanos: 0 },
      overlapPolicy: undefined,
      backfillId: undefined,
    });

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({});
  });

  it('passes optional overlapPolicy and backfillId to gRPC', async () => {
    const { mockBackfillSchedule } = await setup({
      requestBody: JSON.stringify({
        ...defaultRequestBody,
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        backfillId: 'custom-backfill-id',
      }),
    });

    expect(mockBackfillSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        overlapPolicy: ScheduleOverlapPolicy.SCHEDULE_OVERLAP_POLICY_BUFFER,
        backfillId: 'custom-backfill-id',
      })
    );
  });

  it('returns an error when startTime is missing', async () => {
    const { res, mockBackfillSchedule } = await setup({
      requestBody: JSON.stringify({
        endTime: defaultRequestBody.endTime,
      }),
    });

    expect(mockBackfillSchedule).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for schedule backfill',
      })
    );
  });

  it('returns an error when endTime is before startTime', async () => {
    const { res, mockBackfillSchedule } = await setup({
      requestBody: JSON.stringify({
        startTime: '2026-01-02T00:00:00.000Z',
        endTime: '2026-01-01T00:00:00.000Z',
      }),
    });

    expect(mockBackfillSchedule).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for schedule backfill',
      })
    );
  });

  it('returns an error if backfillSchedule throws a GRPCError', async () => {
    const { res, mockBackfillSchedule } = await setup({
      error: new GRPCError('Schedule not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockBackfillSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(404);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Schedule not found',
      })
    );
  });
});

async function setup({
  requestBody = JSON.stringify(defaultRequestBody),
  scheduleId = 'mock-schedule-id',
  error,
}: {
  requestBody?: string;
  scheduleId?: string;
  error?: GRPCError;
}) {
  const mockBackfillSchedule = jest
    .spyOn(mockGrpcClusterMethods, 'backfillSchedule')
    .mockImplementation(async () => {
      if (error) {
        throw error;
      }
      return {};
    });

  const res = await backfillSchedule(
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

  return { res, mockBackfillSchedule };
}
