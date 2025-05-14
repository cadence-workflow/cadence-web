import { NextRequest } from 'next/server';

import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { signalWorkflow } from '../signal-workflow';
import {
  type SignalWorkflowRequestBody,
  type Context,
} from '../signal-workflow.types';

const defaultRequestBody = {
  signalName: 'test-signal',
  signalInput: '"test-input"',
} satisfies SignalWorkflowRequestBody;

describe(signalWorkflow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls signalWorkflow and returns valid response', async () => {
    const { res, mockSignalWorkflow } = await setup({});

    expect(mockSignalWorkflow).toHaveBeenCalledWith({
      domain: 'mock-domain',
      workflowExecution: {
        workflowId: 'mock-wfid',
        runId: 'mock-runid',
      },
      signalName: 'test-signal',
      signalInput: { data: Buffer.from('"test-input"') },
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({});
  });

  it('calls signalWorkflow without signalInput when not provided', async () => {
    const { mockSignalWorkflow } = await setup({
      requestBody: JSON.stringify({
        signalName: 'signal-without-input',
      }),
    });

    expect(mockSignalWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        signalName: 'signal-without-input',
        signalInput: undefined,
      })
    );
  });

  it('returns an error if something went wrong in the backend', async () => {
    const { res, mockSignalWorkflow } = await setup({
      error: true,
    });

    expect(mockSignalWorkflow).toHaveBeenCalled();

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Could not signal workflow',
      })
    );
  });

  it('returns an error if the signal input has an unexpected format', async () => {
    const { res, mockSignalWorkflow } = await setup({
      requestBody: JSON.stringify({
        signalName: 'test-signal',
        signalInput: 'not-an-object', // should be an object
      } satisfies SignalWorkflowRequestBody),
    });

    expect(mockSignalWorkflow).not.toHaveBeenCalled();

    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid values provided for workflow signal',
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
  const mockSignalWorkflow = jest
    .spyOn(mockGrpcClusterMethods, 'signalWorkflow')
    .mockImplementationOnce(async () => {
      if (error) {
        throw new GRPCError('Could not signal workflow');
      }
      return {};
    });

  const res = await signalWorkflow(
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

  return { res, mockSignalWorkflow };
}
