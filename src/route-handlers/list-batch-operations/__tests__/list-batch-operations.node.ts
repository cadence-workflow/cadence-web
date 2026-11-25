import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';
import queryString from 'query-string';

import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { listBatchOperations } from '../list-batch-operations';
import {
  type Context,
  type ListBatchOperationsResponse,
  type RequestParams,
} from '../list-batch-operations.types';

jest.mock('@/utils/logger');

const mockResponse: ListBatchOperationsResponse = {
  batchOperations: [
    {
      batchId: 'mock-batch-1',
      state: 'BATCH_OPERATION_STATE_RUNNING',
      startedBy: 'mock-user',
      startTime: { seconds: '1700000000', nanos: 0 },
      closeTime: null,
    },
  ],
  nextPageToken: 'mock-next-token',
};

describe(listBatchOperations.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('lists the batches of the domain in the route and returns the response', async () => {
    const { res, mockListBatchOperations } = await setup({});

    expect(mockListBatchOperations).toHaveBeenCalledWith({
      domain: 'mock-domain',
      state: undefined,
      pageSize: 25,
      nextPageToken: undefined,
    });
    expect(await res.json()).toEqual(mockResponse);
  });

  it('passes the page size, page token and state filter through', async () => {
    const { mockListBatchOperations } = await setup({
      queryParams: {
        pageSize: '10',
        nextPage: 'mock-token',
        state: 'BATCH_OPERATION_STATE_STOPPED',
      },
    });

    expect(mockListBatchOperations).toHaveBeenCalledWith({
      domain: 'mock-domain',
      state: 'BATCH_OPERATION_STATE_STOPPED',
      pageSize: 10,
      nextPageToken: 'mock-token',
    });
  });

  it('returns a 400 for an unknown state', async () => {
    const { res, mockListBatchOperations } = await setup({
      queryParams: { state: 'BATCH_OPERATION_STATE_INVALID' },
    });

    expect(mockListBatchOperations).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for listing batch operations',
      })
    );
  });

  it('returns a 400 for a page size that is not positive', async () => {
    const { res, mockListBatchOperations } = await setup({
      queryParams: { pageSize: '0' },
    });

    expect(mockListBatchOperations).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
  });

  it('returns the status of a gRPC error and logs it', async () => {
    const { res } = await setup({ error: 'permission' });

    expect(res.status).toEqual(403);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Request unauthorized.' })
    );
    expect(logger.error).toHaveBeenCalled();
  });

  it('returns a 500 for an unexpected error', async () => {
    const { res } = await setup({ error: 'unexpected' });

    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Error fetching batch operations' })
    );
  });
});

async function setup({
  queryParams,
  error,
}: {
  queryParams?: Record<string, string>;
  error?: 'permission' | 'unexpected';
}) {
  const mockListBatchOperations = jest
    .spyOn(mockGrpcClusterMethods, 'listBatchOperations')
    .mockImplementationOnce(async () => {
      if (error === 'permission') {
        throw new GRPCError('Request unauthorized.', {
          grpcStatusCode: status.PERMISSION_DENIED,
        });
      }
      if (error === 'unexpected') {
        throw new Error('boom');
      }
      return mockResponse;
    });

  const res = await listBatchOperations(
    new NextRequest(
      `http://localhost/api/domains/mock-domain/mock-cluster/batch-operations?${queryString.stringify(queryParams ?? {})}`
    ),
    {
      params: { domain: 'mock-domain', cluster: 'mock-cluster' },
    } as RequestParams,
    { grpcClusterMethods: mockGrpcClusterMethods } as Context
  );

  return { res, mockListBatchOperations };
}
