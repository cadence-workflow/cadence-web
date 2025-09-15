import crypto from 'crypto';

import { type StartWorkflowExecutionRequest__Input } from '@/__generated__/proto-ts/uber/cadence/api/v1/StartWorkflowExecutionRequest';
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

type FieldsTestCase = {
  name: string;
  inputField: Partial<StartWorkflowRequestBody>;
  expectedOutput: Partial<StartWorkflowExecutionRequest__Input>;
};

const fieldsTestCases: FieldsTestCase[] = [
  {
    name: 'handles firstRunAt field correctly',
    inputField: { firstRunAt: '2024-01-01T10:00:00.000Z' },
    expectedOutput: {
      firstRunAt: {
        seconds: 1704103200,
        nanos: 0,
      },
    },
  },
  {
    name: 'handles cronSchedule field correctly',
    inputField: { cronSchedule: '0 0 * * *' },
    expectedOutput: {
      cronSchedule: '0 0 * * *',
    },
  },
  {
    name: 'handles workflowIdReusePolicy field correctly',
    inputField: {
      workflowIdReusePolicy: 'WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE',
    },
    expectedOutput: {
      workflowIdReusePolicy: 'WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE',
    },
  },
  {
    name: 'handles retryPolicy field correctly',
    inputField: {
      retryPolicy: {
        initialIntervalSeconds: 1,
        backoffCoefficient: 2.0,
        maximumIntervalSeconds: 100,
        expirationIntervalSeconds: 1000,
        maximumAttempts: 3,
      },
    },
    expectedOutput: {
      retryPolicy: {
        initialInterval: { seconds: 1 },
        backoffCoefficient: 2.0,
        maximumInterval: { seconds: 100 },
        expirationInterval: { seconds: 1000 },
        maximumAttempts: 3,
      },
    },
  },
  {
    name: 'handles empty retryPolicy correctly',
    inputField: { retryPolicy: undefined },
    expectedOutput: {
      retryPolicy: undefined,
    },
  },
  {
    name: 'handles memo field correctly',
    inputField: {
      memo: {
        key1: 'value1',
        key2: { nested: 'object' },
        key3: 123,
      },
    },
    expectedOutput: {
      memo: {
        fields: {
          key1: { data: Buffer.from('"value1"', 'utf-8') },
          key2: { data: Buffer.from('{"nested":"object"}', 'utf-8') },
          key3: { data: Buffer.from('123', 'utf-8') },
        },
      },
    },
  },
  {
    name: 'handles searchAttributes field correctly',
    inputField: {
      searchAttributes: {
        CustomStringField: 'search-value',
        CustomIntField: 42,
        CustomBoolField: true,
      },
    },
    expectedOutput: {
      searchAttributes: {
        indexedFields: {
          CustomStringField: { data: Buffer.from('"search-value"', 'utf-8') },
          CustomIntField: { data: Buffer.from('42', 'utf-8') },
          CustomBoolField: { data: Buffer.from('true', 'utf-8') },
        },
      },
    },
  },
  {
    name: 'handles header field correctly',
    inputField: {
      header: {
        'X-Custom-Header': 'custom-value',
        'X-Another-Header': 'another-value',
      },
    },
    expectedOutput: {
      header: {
        fields: {
          'X-Custom-Header': { data: Buffer.from('custom-value', 'utf-8') },
          'X-Another-Header': { data: Buffer.from('another-value', 'utf-8') },
        },
      },
    },
  },
];

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
      ...defaultRequestBody,
      workflowId: undefined,
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

  fieldsTestCases.forEach(({ name, inputField, expectedOutput }) => {
    it(name, async () => {
      const requestBodyWithField: StartWorkflowRequestBody = {
        ...defaultRequestBody,
        ...inputField,
      };

      const { mockStartWorkflow } = await setup({
        requestBody: requestBodyWithField,
      });

      expect(mockStartWorkflow).toHaveBeenCalledWith(
        expect.objectContaining(expectedOutput)
      );
    });
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
