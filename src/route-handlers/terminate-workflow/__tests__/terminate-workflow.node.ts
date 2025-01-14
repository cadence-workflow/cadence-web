import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__fixtures__/grpc-cluster-methods';

import { terminateWorkflow } from '../terminate-workflow';
import {
  type TerminateWorkflowResponse,
  type Context,
} from '../terminate-workflow.types';

describe(terminateWorkflow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls terminateWorkflow and returns valid response', async () => {
    const { res, mockTerminateWorkflow } = await setup({});

    expect(mockTerminateWorkflow).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
      reason: 'Terminating workflow from cadence-web UI',
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({});
  });

  it('calls terminateWorkflow with termination reason', async () => {
    const { mockTerminateWorkflow } = await setup({
      requestBody: JSON.stringify({
        reason: 'This workflow needs to be terminated for various reasons',
      }),
    });

    expect(mockTerminateWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'This workflow needs to be terminated for various reasons',
      })
    );
  });

  it('returns an error if something went wrong in the backend', async () => {
    const { res, mockTerminateWorkflow } = await setup({
      error: true,
    });

    expect(mockTerminateWorkflow).toHaveBeenCalled();

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Could not terminate workflow',
      })
    );
  });

  it('returns an error if the request body is not in an expected format', async () => {
    const { res, mockTerminateWorkflow } = await setup({
      requestBody: JSON.stringify({
        reason: 5,
      }),
    });

    expect(mockTerminateWorkflow).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for workflow termination',
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
  const mockTerminateWorkflow = jest
    .spyOn(mockGrpcClusterMethods, 'terminateWorkflow')
    .mockImplementationOnce(async () => {
      if (error) {
        throw new GRPCError('Could not terminate workflow');
      }
      return {} satisfies TerminateWorkflowResponse;
    });

  const res = await terminateWorkflow(
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

  return { res, mockTerminateWorkflow };
}
