import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';
import queryString from 'query-string';

import type { ListSchedulesResponse as ListSchedulesResponseProto } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListSchedulesResponse';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { listSchedules } from '../list-schedules';
import { type Context, type RequestParams } from '../list-schedules.types';

jest.mock('@/utils/logger');

const mockSchedules: ListSchedulesResponseProto['schedules'] = [
  {
    scheduleId: 'mock-schedule-id-1',
    workflowType: { name: 'mock-workflow-type-1' },
    state: { paused: false, pauseInfo: null },
    cronExpression: '0 * * * *',
  },
  {
    scheduleId: 'mock-schedule-id-2',
    workflowType: { name: 'mock-workflow-type-2' },
    state: { paused: true, pauseInfo: null },
    cronExpression: '*/5 * * * *',
  },
];

describe(listSchedules.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls listSchedules and returns valid response', async () => {
    const { res, mockListSchedules } = await setup({
      queryParams: { pageSize: '10' },
    });

    expect(mockListSchedules).toHaveBeenCalledWith({
      domain: 'mock-domain',
      pageSize: 10,
      nextPageToken: undefined,
    });

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson).toEqual({
      schedules: mockSchedules,
      nextPageToken: 'mock-next-page-token',
    });
  });

  it('forwards nextPage query param as nextPageToken', async () => {
    const { res, mockListSchedules } = await setup({
      queryParams: { pageSize: '25', nextPage: 'token-123' },
    });

    expect(mockListSchedules).toHaveBeenCalledWith({
      domain: 'mock-domain',
      pageSize: 25,
      nextPageToken: 'token-123',
    });
    expect(res.status).toEqual(200);
  });

  it('defaults pageSize to 25 when not provided', async () => {
    const { res, mockListSchedules } = await setup({
      queryParams: {},
    });

    expect(mockListSchedules).toHaveBeenCalledWith({
      domain: 'mock-domain',
      pageSize: 25,
      nextPageToken: undefined,
    });
    expect(res.status).toEqual(200);
  });

  it('returns validation error when pageSize is not a positive integer', async () => {
    const { res, mockListSchedules } = await setup({
      queryParams: { pageSize: '0' },
    });

    expect(mockListSchedules).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for listing schedules',
        validationErrors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Page size must be a positive integer',
          }),
        ]),
      })
    );
  });

  it('returns error when listSchedules throws a GRPCError', async () => {
    const { res, mockListSchedules } = await setup({
      queryParams: { pageSize: '10' },
      error: new GRPCError('Schedule service unavailable', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockListSchedules).toHaveBeenCalled();
    expect(res.status).toEqual(404);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Schedule service unavailable',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        queryParams: expect.any(Object),
        error: expect.any(GRPCError),
      }),
      'Error fetching schedules: Schedule service unavailable'
    );
  });

  it('returns error when listSchedules throws a generic error', async () => {
    const { res, mockListSchedules } = await setup({
      queryParams: { pageSize: '10' },
      error: new Error('Network error'),
    });

    expect(mockListSchedules).toHaveBeenCalled();
    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Error fetching schedules',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        queryParams: expect.any(Object),
        error: expect.any(Error),
      }),
      'Error fetching schedules'
    );
  });
});

async function setup({
  queryParams,
  error,
}: {
  queryParams: Record<string, string | string[] | undefined>;
  error?: Error;
}) {
  const mockListSchedules = jest
    .spyOn(mockGrpcClusterMethods, 'listSchedules')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return {
        schedules: mockSchedules,
        nextPageToken: 'mock-next-page-token',
      };
    });

  const res = await listSchedules(
    new NextRequest(`http://localhost?${queryString.stringify(queryParams)}`),
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

  return { res, mockListSchedules };
}
