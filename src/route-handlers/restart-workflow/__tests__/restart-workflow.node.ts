import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { restartWorkflow } from '../restart-workflow';
import {
  type RestartWorkflowResponse,
  type Context,
} from '../restart-workflow.types';

describe(restartWorkflow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls restartWorkflow and returns valid response', async () => {
    const { res, mockRestartWorkflow } = await setup({});

    expect(mockRestartWorkflow).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
      reason: 'Restarting workflow from cadence-web UI',
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({ runId: 'mock-runid-new' });
  });

  it('calls restartWorkflow with custom reason', async () => {
    const { mockRestartWorkflow } = await setup({
      requestBody: JSON.stringify({
        reason: 'This workflow needs to be restarted for various reasons',
      }),
    });

    expect(mockRestartWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'This workflow needs to be restarted for various reasons',
      })
    );
  });

  it('returns an error if something went wrong in the backend', async () => {
    const { res, mockRestartWorkflow } = await setup({
      error: true,
    });

    expect(mockRestartWorkflow).toHaveBeenCalled();

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Could not restart workflow',
      })
    );
  });

  it('returns an error if the request body is not in an expected format', async () => {
    const { res, mockRestartWorkflow } = await setup({
      requestBody: JSON.stringify({
        reason: 5,
      }),
    });

    expect(mockRestartWorkflow).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for workflow restart',
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
  const mockRestartWorkflow = jest
    .spyOn(mockGrpcClusterMethods, 'restartWorkflow')
    .mockImplementationOnce(async () => {
      if (error) {
        throw new GRPCError('Could not restart workflow');
      }
      return { runId: 'mock-runid-new' } satisfies RestartWorkflowResponse;
    });

  const res = await restartWorkflow(
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

  return { res, mockRestartWorkflow };
}
