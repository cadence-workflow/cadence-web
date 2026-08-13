import { status } from '@grpc/grpc-js';
import { NextRequest } from 'next/server';
import queryString from 'query-string';

import * as getConfigValueModule from '@/utils/config/get-config-value';
import { GRPCError } from '@/utils/grpc/grpc-error';
import logger from '@/utils/logger';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';
import * as getVisibilityQueryModule from '@/utils/visibility/get-visibility-query';

import { countWorkflows } from '../count-workflows';
import type { Context } from '../count-workflows.types';

jest.mock('@/utils/logger');
jest.mock('@/utils/visibility/get-visibility-query');
jest.mock('@/utils/config/get-config-value');

describe(countWorkflows.name, () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls countWorkflows with query inputType and returns count', async () => {
    const { res, mockCountWorkflows } = await setup({
      queryParams: {
        listType: 'default',
        inputType: 'query',
        query: 'WorkflowType="foo"',
      },
    });

    expect(mockCountWorkflows).toHaveBeenCalledWith({
      domain: 'mock-domain',
      query: 'WorkflowType="foo"',
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({ count: 42 });
  });

  it('calls countWorkflows with search inputType using query builder', async () => {
    const { res, mockCountWorkflows, mockGetListWorkflowExecutionsQuery } =
      await setup({
        queryParams: {
          listType: 'default',
          inputType: 'search',
        },
      });

    expect(mockGetListWorkflowExecutionsQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        search: undefined,
      })
    );
    expect(mockCountWorkflows).toHaveBeenCalledWith({
      domain: 'mock-domain',
      query: 'mock list workflow executions query',
    });

    const responseJson = await res.json();
    expect(responseJson).toEqual({ count: 42 });
  });

  it('swallows getConfigValue errors and still returns count', async () => {
    const { res, mockCountWorkflows, mockGetConfigValue } = await setup({
      queryParams: {
        listType: 'default',
        inputType: 'search',
      },
      configError: new Error('config blew up'),
    });

    expect(mockGetConfigValue).toHaveBeenCalledWith(
      'LIST_WORKFLOWS_PARTIAL_MATCH_ENABLED'
    );
    expect(mockCountWorkflows).toHaveBeenCalled();

    expect(res.status).toEqual(200);
    const responseJson = await res.json();
    expect(responseJson).toEqual({ count: 42 });
  });

  it('returns validation error for invalid query params', async () => {
    const { res, mockCountWorkflows } = await setup({
      queryParams: {
        listType: 'invalid-type',
        inputType: 'query',
      },
    });

    expect(mockCountWorkflows).not.toHaveBeenCalled();

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for workflow count',
      })
    );
  });

  it('returns error if countWorkflows throws GRPCError', async () => {
    const { res, mockCountWorkflows } = await setup({
      queryParams: {
        listType: 'default',
        inputType: 'query',
        query: 'WorkflowType="foo"',
      },
      error: new GRPCError('Domain not found', {
        grpcStatusCode: status.NOT_FOUND,
      }),
    });

    expect(mockCountWorkflows).toHaveBeenCalled();

    expect(res.status).toEqual(404);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Domain not found',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        error: expect.any(GRPCError),
      }),
      'Error counting workflows: Domain not found'
    );
  });

  it('returns error if countWorkflows throws generic error', async () => {
    const { res, mockCountWorkflows } = await setup({
      queryParams: {
        listType: 'default',
        inputType: 'query',
        query: 'WorkflowType="foo"',
      },
      error: new Error('Network error'),
    });

    expect(mockCountWorkflows).toHaveBeenCalled();

    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Error counting workflows',
      })
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        requestParams: { domain: 'mock-domain', cluster: 'mock-cluster' },
        error: expect.any(Error),
      }),
      'Error counting workflows'
    );
  });
});

async function setup({
  queryParams,
  error,
  configError,
}: {
  queryParams: Record<string, string | string[] | undefined>;
  error?: Error;
  configError?: Error;
}) {
  const mockGetConfigValue = (
    jest.spyOn(getConfigValueModule, 'default') as jest.Mock
  ).mockImplementation(async () => {
    if (configError) {
      throw configError;
    }
    return false;
  });

  const mockGetListWorkflowExecutionsQuery = jest
    .spyOn(getVisibilityQueryModule, 'default')
    .mockReturnValue('mock list workflow executions query');

  const mockCountWorkflows = jest
    .spyOn(mockGrpcClusterMethods, 'countWorkflows')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return { count: '42' };
    });

  const res = await countWorkflows(
    new NextRequest(`http://localhost?${queryString.stringify(queryParams)}`),
    {
      params: {
        domain: 'mock-domain',
        cluster: 'mock-cluster',
      },
    },
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return {
    res,
    mockCountWorkflows,
    mockGetListWorkflowExecutionsQuery,
    mockGetConfigValue,
  };
}
