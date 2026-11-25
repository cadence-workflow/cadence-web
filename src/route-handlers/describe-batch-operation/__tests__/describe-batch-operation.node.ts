import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { describeBatchOperation } from '../describe-batch-operation';
import {
  type Context,
  type DescribeBatchOperationResponse,
  type RequestParams,
} from '../describe-batch-operation.types';

jest.mock('@/utils/logger');

const mockResponse: DescribeBatchOperationResponse = {
  operation: { terminate: { terminateChildren: null }, operation: 'terminate' },
  query: 'CloseTime = missing',
  reason: 'mock reason',
  state: 'BATCH_OPERATION_STATE_RUNNING',
  progress: { totalEstimate: '300', successCount: '12', errorCount: '0' },
  limits: { rps: 5, concurrency: 5, pageSize: 100 },
  startedBy: 'mock-user',
  startTime: { seconds: '1700000000', nanos: 0 },
  closeTime: null,
};

describe(describeBatchOperation.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('describes the batch in the domain from the route and returns the response', async () => {
    const { res, mockDescribeBatchOperation } = await setup({});

    expect(mockDescribeBatchOperation).toHaveBeenCalledWith({
      domain: 'mock-domain',
      batchId: 'mock-batch-id',
    });
    expect(await res.json()).toEqual(mockResponse);
  });

  it('returns a 404 when the batch does not exist', async () => {
    const { res } = await setup({ error: 'not-found' });

    expect(res.status).toEqual(404);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Batch operation not found' })
    );
    expect(logger.error).toHaveBeenCalled();
  });

  it('returns the status of a permission error', async () => {
    const { res } = await setup({ error: 'permission' });

    expect(res.status).toEqual(403);
  });

  it('returns a 500 for an unexpected error', async () => {
    const { res } = await setup({ error: 'unexpected' });

    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Error describing batch operation' })
    );
  });
});

async function setup({
  error,
}: {
  error?: 'not-found' | 'permission' | 'unexpected';
}) {
  const mockDescribeBatchOperation = jest
    .spyOn(mockGrpcClusterMethods, 'describeBatchOperation')
    .mockImplementationOnce(async () => {
      if (error === 'not-found') {
        throw new GRPCError('Batch operation not found', {
          grpcStatusCode: status.NOT_FOUND,
        });
      }
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

  const res = await describeBatchOperation(
    new NextRequest('http://localhost'),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        batchId: 'mock-batch-id',
      },
    } as RequestParams,
    { grpcClusterMethods: mockGrpcClusterMethods } as Context
  );

  return { res, mockDescribeBatchOperation };
}
