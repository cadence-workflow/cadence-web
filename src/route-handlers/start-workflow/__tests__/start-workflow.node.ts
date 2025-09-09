import crypto from 'crypto';

import { GRPCError } from '@/utils/grpc/grpc-error';

import { startWorkflow } from '../start-workflow';
import { type StartWorkflowRequestBody } from '../start-workflow.types';

const defaultRequestBody: StartWorkflowRequestBody = {
  workflowId: 'test-workflow-id',
  workflowType: {
    name: 'TestWorkflow',
  },
  taskList: {
    name: 'test-task-list',
  },
  input: ['test-input'],
  workerSDKLanguage: 'GO',
  executionStartToCloseTimeoutSeconds: 30,
  taskStartToCloseTimeoutSeconds: 10,
};

describe(startWorkflow.name, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls startWorkflow and returns valid response', async () => {
    const { res, mockStartWorkflow } = await setup({});

    expect(mockStartWorkflow).toHaveBeenCalledWith({
      domain: 'test-domain',
      workflowId: 'test-workflow-id',
      workflowType: { name: 'TestWorkflow' },
      taskList: { name: 'test-task-list' },
      input: { data: Buffer.from('"test-input"', 'utf-8') },
      executionStartToCloseTimeout: { seconds: 30 },
      taskStartToCloseTimeout: { seconds: 10 },
      firstRunAt: undefined,
      cronSchedule: undefined,
      identity: 'test-user-id',
      requestId: expect.any(String),
    });

    const responseData = await res.json();
    expect(responseData).toEqual({
      runId: 'test-run-id',
      workflowId: 'test-workflow-id',
    });
  });

  it('handles missing optional fields correctly', async () => {
    const minimalRequestBody: StartWorkflowRequestBody = {
      workflowId: 'test-workflow-id',
      workflowType: {
        name: 'TestWorkflow',
      },
      taskList: {
        name: 'test-task-list',
      },
      workerSDKLanguage: 'GO',
      executionStartToCloseTimeoutSeconds: 30,
    };

    const { res, mockStartWorkflow } = await setup({
      requestBody: minimalRequestBody,
    });

    expect(mockStartWorkflow).toHaveBeenCalledWith({
      domain: 'test-domain',
      workflowId: 'test-workflow-id',
      workflowType: { name: 'TestWorkflow' },
      taskList: { name: 'test-task-list' },
      input: undefined,
      executionStartToCloseTimeout: { seconds: 30 },
      taskStartToCloseTimeout: { seconds: 10 },
      firstRunAt: undefined,
      cronSchedule: undefined,
      identity: 'test-user-id',
      requestId: expect.any(String),
    });

    const responseData = await res.json();
    expect(responseData).toEqual({
      runId: 'test-run-id',
      workflowId: 'test-workflow-id',
    });
  });

  it('returns error for invalid request body', async () => {
    const invalidRequestBody = {
      workflowType: {
        name: '', // Invalid: empty string
      },
      taskList: {
        name: '', // Invalid: empty string
      },
      workerSDKLanguage: 'GO' as const,
      executionStartToCloseTimeoutSeconds: 30,
    };

    const { res, mockStartWorkflow } = await setup({
      requestBody: invalidRequestBody,
    });

    expect(mockStartWorkflow).not.toHaveBeenCalled();
    expect(res.status).toBe(400);
    const responseData = await res.json();
    expect(responseData.message).toBe(
      'Invalid values provided for workflow start'
    );
    expect(responseData.validationErrors).toBeDefined();
  });

  it('handles GRPC errors correctly', async () => {
    const { res, mockStartWorkflow } = await setup({
      error: 'Internal server error',
    });

    expect(mockStartWorkflow).toHaveBeenCalled();
    expect(res.status).toBe(500);
    const responseData = await res.json();
    expect(responseData.message).toBe('Internal server error');
    expect(responseData.cause).toBeDefined();
  });

  it('handles unknown errors correctly', async () => {
    const { res, mockStartWorkflow } = await setup({
      error: new Error('Unknown error'),
    });

    expect(mockStartWorkflow).toHaveBeenCalled();
    expect(res.status).toBe(500);
    const responseData = await res.json();
    expect(responseData.message).toBe('Error starting workflow');
    expect(responseData.cause).toBeDefined();
  });

  it('generates workflowId when not provided', async () => {
    const requestBodyWithoutWorkflowId: StartWorkflowRequestBody = {
      workflowType: {
        name: 'TestWorkflow',
      },
      taskList: {
        name: 'test-task-list',
      },
      workerSDKLanguage: 'GO',
      executionStartToCloseTimeoutSeconds: 30,
    };
    const generateWorkflowId = 'test-uuid-123-456-789-101-112';
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(generateWorkflowId);

    const { res, mockStartWorkflow } = await setup({
      requestBody: requestBodyWithoutWorkflowId,
    });

    expect(mockStartWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        workflowId: generateWorkflowId,
      })
    );

    const responseData = await res.json();
    expect(typeof responseData.workflowId).toBe('string');
  });

  it('handles firstRunAt field correctly', async () => {
    const requestBodyWithFirstRunAt: StartWorkflowRequestBody = {
      workflowId: 'test-workflow-id',
      workflowType: {
        name: 'TestWorkflow',
      },
      taskList: {
        name: 'test-task-list',
      },
      workerSDKLanguage: 'GO',
      executionStartToCloseTimeoutSeconds: 30,
      firstRunAt: '2024-01-01T10:00:00.000Z',
    };

    const { mockStartWorkflow } = await setup({
      requestBody: requestBodyWithFirstRunAt,
    });

    expect(mockStartWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        firstRunAt: expect.objectContaining({
          seconds: 1704103200,
          nanos: 0,
        }),
      })
    );
  });
});

async function setup({
  requestBody = defaultRequestBody,
  error,
}: {
  requestBody?: StartWorkflowRequestBody;
  error?: string | Error;
}) {
  const mockStartWorkflow = jest.fn() as jest.MockedFunction<any>;
  const mockContext = {
    grpcClusterMethods: {
      startWorkflow: mockStartWorkflow,
    },
    userInfo: {
      id: 'test-user-id',
    },
  };

  const mockOptions = {
    params: {
      domain: 'test-domain',
      cluster: 'test-cluster',
    },
  };

  const mockRequest = {
    json: jest.fn(),
  } as any;

  mockRequest.json.mockResolvedValue(requestBody);

  if (error) {
    if (typeof error === 'string') {
      mockStartWorkflow.mockRejectedValue(new GRPCError(error));
    } else {
      mockStartWorkflow.mockRejectedValue(error);
    }
  } else {
    mockStartWorkflow.mockResolvedValue({
      runId: 'test-run-id',
    });
  }

  const res = await startWorkflow(mockRequest, mockOptions, mockContext as any);

  return { res, mockStartWorkflow };
}
