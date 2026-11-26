import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { startBatchAction } from '../start-batch-action';
import {
  type Context,
  type StartBatchActionResponse,
} from '../start-batch-action.types';

const VALID_BODY = {
  batchType: 'terminate',
  query: 'CloseTime = missing',
  reason: 'cleanup',
  rps: 10,
};

describe(startBatchAction.name, () => {
  beforeEach(() => {
    // reset, not clear: unused queued mocks from 400 tests would leak forward
    jest.resetAllMocks();
  });

  it('starts the batch on the domain from the route and returns the batch id', async () => {
    const { res, mockStartBatchOperation } = await setup({
      requestBody: { ...VALID_BODY, batchId: 'mock-batch-id' },
    });

    expect(mockStartBatchOperation).toHaveBeenCalledWith({
      domain: 'mock-domain',
      batchId: 'mock-batch-id',
      query: 'CloseTime = missing',
      operation: { terminate: {} },
      reason: 'cleanup',
      identity: 'mock-user',
      limits: { rps: 10 },
    });
    expect(await res.json()).toEqual({ batchId: 'mock-batch-id' });
  });

  it('generates a batch id when none is provided', async () => {
    const { mockStartBatchOperation } = await setup({
      requestBody: VALID_BODY,
    });

    expect(mockStartBatchOperation).toHaveBeenCalledWith(
      expect.objectContaining({ batchId: expect.any(String) })
    );
    expect(mockStartBatchOperation.mock.calls[0][0].batchId).not.toBe('');
  });

  it('returns a 400 when a signal action has no signal params', async () => {
    const { res, mockStartBatchOperation } = await setup({
      requestBody: { ...VALID_BODY, batchType: 'signal' },
    });

    expect(mockStartBatchOperation).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for batch action start',
      })
    );
  });

  it('returns a 400 when rps is out of range', async () => {
    const { res, mockStartBatchOperation } = await setup({
      requestBody: { ...VALID_BODY, rps: 0 },
    });

    expect(mockStartBatchOperation).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
  });

  it('returns a 400 when the batch type is unknown', async () => {
    const { res, mockStartBatchOperation } = await setup({
      requestBody: { ...VALID_BODY, batchType: 'replicate' },
    });

    expect(mockStartBatchOperation).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
  });

  it('returns an error if something went wrong in the backend', async () => {
    const { res, mockStartBatchOperation } = await setup({
      requestBody: VALID_BODY,
      error: true,
    });

    expect(mockStartBatchOperation).toHaveBeenCalled();
    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Could not start batch operation' })
    );
  });
});

async function setup({
  requestBody,
  error,
}: {
  requestBody: Record<string, unknown>;
  error?: true;
}) {
  const mockStartBatchOperation = jest
    .spyOn(mockGrpcClusterMethods, 'startBatchOperation')
    .mockImplementationOnce(async (request) => {
      if (error) {
        throw new GRPCError('Could not start batch operation');
      }
      return {
        batchId: request.batchId ?? '',
      } satisfies StartBatchActionResponse;
    });

  const res = await startBatchAction(
    new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    }),
    { params: { domain: 'mock-domain', cluster: 'mock-cluster' } },
    {
      grpcClusterMethods: mockGrpcClusterMethods,
      userInfo: { id: 'mock-user' },
    } as Context
  );

  return { res, mockStartBatchOperation };
}
