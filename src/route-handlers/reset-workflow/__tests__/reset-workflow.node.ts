import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { resetWorkflow } from '../reset-workflow';
import { type Context } from '../reset-workflow.types';

const defaultRequestBody = {
  reason: 'Resetting workflow from cadence-web UI',
  decisionFinishEventId: 4,
  requestId: '',
  skipSignalReapply: false,
};

describe(resetWorkflow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls resetWorkflow and returns valid response', async () => {
    const { res, mockResetWorkflow } = await setup({});

    expect(mockResetWorkflow).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
      ...defaultRequestBody,
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({ runId: 'mock-runid-new' });
  });

  it('calls resetWorkflow with passed request body', async () => {
    const { mockResetWorkflow } = await setup({
      requestBody: JSON.stringify({
        reason: 'This workflow needs to be reset',
        decisionFinishEventId: 123,
        requestId: 'test-request-id',
        skipSignalReapply: true,
      }),
    });

    expect(mockResetWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'This workflow needs to be reset',
        decisionFinishEventId: 123,
        requestId: 'test-request-id',
        skipSignalReapply: true,
      })
    );
  });

  it('returns an error if something went wrong in the backend', async () => {
    const { res, mockResetWorkflow } = await setup({
      error: true,
    });

    expect(mockResetWorkflow).toHaveBeenCalled();

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Could not reset workflow',
      })
    );
  });

  it('returns an error if the request body is not in an expected format', async () => {
    const { res, mockResetWorkflow } = await setup({
      requestBody: JSON.stringify({
        reason: 5, // should be a string
        decisionFinishEventId: 'not-a-number', // should be a number
      }),
    });

    expect(mockResetWorkflow).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for workflow reset',
      })
    );
  });
});

async function setup({
  requestBody = JSON.stringify(defaultRequestBody),
  error,
}: {
  requestBody?: string;
  error?: true;
}) {
  const mockResetWorkflow = jest
    .spyOn(mockGrpcClusterMethods, 'resetWorkflow')
    .mockImplementationOnce(async () => {
      if (error) {
        throw new GRPCError('Could not reset workflow');
      }
      return { runId: 'mock-runid-new' };
    });

  const res = await resetWorkflow(
    new NextRequest('http://localhost', {
      method: 'POST',
      body: requestBody ?? '{}',
    }),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
    },
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockResetWorkflow };
}
