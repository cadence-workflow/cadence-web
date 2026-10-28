import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { queryWorkflow } from '../query-workflow';
import { type Context } from '../query-workflow.types';

describe(queryWorkflow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls queryWorkflow and returns the decoded result', async () => {
    const { res, mockQueryWorkflow } = await setup({});

    expect(mockQueryWorkflow).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
      query: {
        queryType: 'mock-query',
        queryArgs: { data: Buffer.from('') },
      },
    });
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual({ result: { a: 1 }, rejected: null });
  });

  it('returns an error for invalid JSON input', async () => {
    const { res, mockQueryWorkflow } = await setup({ requestBody: '{' });

    expect(mockQueryWorkflow).not.toHaveBeenCalled();
    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual({
      message: 'Invalid JSON input provided for workflow querying',
    });
  });

  it('returns the message and status code of a GRPCError', async () => {
    const { res } = await setup({
      error: new GRPCError(
        'unknown queryType home. KnownQueryTypes=[__stack_trace]',
        { grpcStatusCode: status.INVALID_ARGUMENT }
      ),
    });

    expect(res.status).toEqual(400);
    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'unknown queryType home. KnownQueryTypes=[__stack_trace]',
      })
    );
  });

  it('returns the message of a GRPCError from another copy of the module', async () => {
    const error = new Error('unknown queryType home. KnownQueryTypes=[]');
    error.name = 'GRPCError';
    const { res } = await setup({ error });

    expect(await res.json()).toEqual(
      expect.objectContaining({
        message: 'unknown queryType home. KnownQueryTypes=[]',
      })
    );
  });

  it('returns a generic message for other errors', async () => {
    const { res } = await setup({ error: new Error('internal details') });

    expect(res.status).toEqual(500);
    expect(await res.json()).toEqual(
      expect.objectContaining({ message: 'Error querying workflow' })
    );
  });
});

async function setup({
  requestBody = '',
  error,
}: {
  requestBody?: string;
  error?: Error;
}) {
  const mockQueryWorkflow = jest
    .spyOn(mockGrpcClusterMethods, 'queryWorkflow')
    .mockImplementation(async () => {
      if (error) {
        throw error;
      }
      return {
        queryResult: {
          data: Buffer.from(JSON.stringify({ a: 1 })).toString('base64'),
        },
        queryRejected: null,
      };
    });

  const res = await queryWorkflow(
    new NextRequest('http://localhost', {
      method: 'POST',
      body: requestBody,
    }),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
        queryName: 'mock-query',
      },
    },
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockQueryWorkflow };
}
