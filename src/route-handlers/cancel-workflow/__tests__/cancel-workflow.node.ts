import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { cancelWorkflow } from '../cancel-workflow';
import {
  type CancelWorkflowResponse,
  type Context,
} from '../cancel-workflow.types';

describe(cancelWorkflow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls requestCancelWorkflow and returns valid response', async () => {
    const { res, mockRequestCancelWorkflow } = await setup({});

    expect(mockRequestCancelWorkflow).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
      cause: 'Requesting workflow cancellation from cadence-web UI',
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({});
  });

  it('calls requestCancelWorkflow with cancellation reason', async () => {
    const { mockRequestCancelWorkflow } = await setup({
      requestBody: JSON.stringify({
        cause: 'This workflow needs to be cancelled for various reasons',
      }),
    });

    expect(mockRequestCancelWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        cause: 'This workflow needs to be cancelled for various reasons',
      })
    );
  });

  it('returns an error if something went wrong in the backend', async () => {
    const { res, mockRequestCancelWorkflow } = await setup({
      error: true,
    });

    expect(mockRequestCancelWorkflow).toHaveBeenCalled();

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Could not cancel workflow',
      })
    );
  });

  it('returns an error if the request body is not in an expected format', async () => {
    const { res, mockRequestCancelWorkflow } = await setup({
      requestBody: JSON.stringify({
        cause: 5,
      }),
    });

    expect(mockRequestCancelWorkflow).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for workflow cancellation',
      })
    );
  });
});

async function setup({
  requestBody,
  error,
}: {
  requestBody?: string;
  error?: true;
}) {
  const mockRequestCancelWorkflow = jest
    .spyOn(mockGrpcClusterMethods, 'requestCancelWorkflow')
    .mockImplementationOnce(async () => {
      if (error) {
        throw new GRPCError('Could not cancel workflow');
      }
      return {} satisfies CancelWorkflowResponse;
    });

  const res = await cancelWorkflow(
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

  return { res, mockRequestCancelWorkflow };
}
