import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { describeSchedule } from '../describe-schedule';
import {
  type Context,
  type DescribeScheduleResponse,
  type RequestParams,
} from '../describe-schedule.types';

jest.mock('@/utils/logger');

const mockDescribeScheduleResponse: DescribeScheduleResponse = {
  spec: null,
  action: null,
  policies: null,
  state: null,
  info: null,
  memo: null,
  searchAttributes: null,
};

describe(describeSchedule.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls describeSchedule and returns valid response', async () => {
    const { res, mockDescribeSchedule } = await setup({});

    expect(mockDescribeSchedule).toHaveBeenCalledWith({
      domain: 'mock-domain',
      scheduleId: 'mock-schedule-id',
    });
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual(mockDescribeScheduleResponse);
  });

  it('returns error when describeSchedule throws a GRPCError', async () => {
    const { res, mockDescribeSchedule } = await setup({
      error: new GRPCError('Schedule not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockDescribeSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(404);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Schedule not found',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: {
          domain: 'mock-domain',
          cluster: 'mock-cluster',
          scheduleId: 'mock-schedule-id',
        },
        error: expect.any(GRPCError),
      }),
      'Error fetching schedule details: Schedule not found'
    );
  });

  it('returns error when describeSchedule throws a generic error', async () => {
    const { res, mockDescribeSchedule } = await setup({
      error: new Error('Network error'),
    });

    expect(mockDescribeSchedule).toHaveBeenCalled();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Error fetching schedule details',
      })
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
      'Error fetching schedule details'
    );
  });
});

async function setup({ error }: { error?: Error }) {
  const mockDescribeSchedule = jest
    .spyOn(mockGrpcClusterMethods, 'describeSchedule')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return mockDescribeScheduleResponse;
    });

  const res = await describeSchedule(
    new NextRequest('http://localhost'),
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

  return { res, mockDescribeSchedule };
}
