import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { mockUpdateScheduleRequestBody } from '../__fixtures__/update-schedule-request-body';
import { updateSchedule } from '../update-schedule';
import { type Context, type RequestParams } from '../update-schedule.types';

jest.mock('@/utils/logger');

describe(updateSchedule.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls updateSchedule with the schedule id from the route params', async () => {
    const { res, mockUpdateSchedule } = await setup({});

    expect(mockUpdateSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: 'mock-domain',
        scheduleId: 'mock-schedule-id',
        spec: expect.objectContaining({ cronExpression: '0 9 * * *' }),
        action: expect.objectContaining({
          startWorkflow: expect.objectContaining({
            workflowType: { name: 'DemoWorkflow' },
          }),
        }),
        policies: expect.any(Object),
      })
    );

    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({});
  });

  it('ignores a schedule id sent in the request body', async () => {
    const { res, mockUpdateSchedule } = await setup({
      body: { ...mockUpdateScheduleRequestBody, scheduleId: 'from-body' },
    });

    expect(res.status).toEqual(200);
    expect(mockUpdateSchedule).toHaveBeenCalledWith(
      expect.objectContaining({ scheduleId: 'mock-schedule-id' })
    );
  });

  it('returns a validation error when the body is invalid', async () => {
    const { res, mockUpdateSchedule } = await setup({
      body: { cronExpression: '' },
    });

    expect(mockUpdateSchedule).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    const json = await res.json();
    expect(json.message).toEqual('Invalid values provided for schedule update');
    expect(Array.isArray(json.validationErrors)).toBe(true);
  });

  it('returns an error when updateSchedule throws a GRPCError', async () => {
    const { res, mockUpdateSchedule } = await setup({
      error: new GRPCError('Schedule not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockUpdateSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(404);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Schedule not found' })
    );
  });

  it('returns an error when updateSchedule throws a generic error', async () => {
    const { res } = await setup({ error: new Error('Network error') });

    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Error updating schedule' })
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: {
          domain: 'mock-domain',
          cluster: 'mock-cluster',
          scheduleId: 'mock-schedule-id',
        },
        error: expect.any(Error),
      }),
      'Error updating schedule'
    );
  });
});

async function setup({ body, error }: { body?: unknown; error?: Error }) {
  const mockUpdateSchedule = jest
    .spyOn(mockGrpcClusterMethods, 'updateSchedule')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return {};
    });

  const res = await updateSchedule(
    new NextRequest('http://localhost', {
      method: 'PUT',
      body: JSON.stringify(body ?? mockUpdateScheduleRequestBody),
    }),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        scheduleId: 'mock-schedule-id',
      },
    } as RequestParams,
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockUpdateSchedule };
}
