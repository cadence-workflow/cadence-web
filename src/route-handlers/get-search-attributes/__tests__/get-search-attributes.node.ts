import { NextRequest } from 'next/server';

import { IndexedValueType } from '@/__generated__/proto-ts/uber/cadence/api/v1/IndexedValueType';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import getSearchAttributes from '../get-search-attributes';
import {
  type Context,
  type RequestParams,
} from '../get-search-attributes.types';

jest.mock('../get-search-attributes.constants', () => ({
  SYSTEM_SEARCH_ATTRIBUTES: new Set(['WorkflowType', 'CloseTime', 'IsCron']),
}));

const mockSearchAttributesResponse = {
  keys: {
    WorkflowType: IndexedValueType.INDEXED_VALUE_TYPE_KEYWORD,
    CloseTime: IndexedValueType.INDEXED_VALUE_TYPE_DATETIME,
    IsCron: IndexedValueType.INDEXED_VALUE_TYPE_BOOL,
    CustomAttribute: IndexedValueType.INDEXED_VALUE_TYPE_STRING,
    AnotherCustom: IndexedValueType.INDEXED_VALUE_TYPE_INT,
  },
};

const baseUrl =
  'http://localhost:3000/api/clusters/test-cluster/search-attributes';

describe('getSearchAttributes', () => {
  it('should return response with all attributes by default', async () => {
    const { mockGetSearchAttributes, response, data } = await setup({
      mockResponse: mockSearchAttributesResponse,
    });

    expect(response.status).toBe(200);
    expect(data).toEqual(mockSearchAttributesResponse);
    expect(mockGetSearchAttributes).toHaveBeenCalledWith({});
  });

  it('should handle RPC errors gracefully', async () => {
    const { mockGetSearchAttributes, response, data } = await setup({
      mockError: new Error('RPC connection failed'),
    });

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('Failed to fetch search attributes');
    expect(mockGetSearchAttributes).toHaveBeenCalledWith({});
  });

  it('should handle empty search attributes response', async () => {
    const { response, data } = await setup({
      mockResponse: { keys: {} },
    });

    expect(response.status).toBe(200);
    expect(data.keys).toEqual({});
  });

  it('should filter system attributes when category=system', async () => {
    const expectedSystemKeys = {
      WorkflowType: IndexedValueType.INDEXED_VALUE_TYPE_KEYWORD,
      CloseTime: IndexedValueType.INDEXED_VALUE_TYPE_DATETIME,
      IsCron: IndexedValueType.INDEXED_VALUE_TYPE_BOOL,
    };

    const { response, data } = await setup({
      mockResponse: mockSearchAttributesResponse,
      url: `${baseUrl}?category=system`,
    });

    expect(response.status).toBe(200);
    expect(data.keys).toEqual(expectedSystemKeys);
  });

  it('should filter custom attributes when category=custom', async () => {
    const expectedCustomKeys = {
      CustomAttribute: IndexedValueType.INDEXED_VALUE_TYPE_STRING,
      AnotherCustom: IndexedValueType.INDEXED_VALUE_TYPE_INT,
    };

    const { response, data } = await setup({
      mockResponse: mockSearchAttributesResponse,
      url: `${baseUrl}?category=custom`,
    });

    expect(response.status).toBe(200);
    expect(data.keys).toEqual(expectedCustomKeys);
  });
});

async function setup(options?: {
  mockResponse?: any;
  mockError?: Error;
  url?: string;
}) {
  const mockGetSearchAttributes = jest
    .spyOn(mockGrpcClusterMethods, 'getSearchAttributes')
    .mockImplementationOnce(async () => {
      if (options?.mockError) {
        throw options.mockError;
      }
      return options?.mockResponse || { keys: {} };
    });

  const context: Context = {
    grpcClusterMethods: mockGrpcClusterMethods,
  };

  const request = new NextRequest(options?.url || baseUrl);
  const requestParams: RequestParams = {
    params: { cluster: 'test-cluster' },
  };

  const response = await getSearchAttributes(request, requestParams, context);
  const data = await response.json();

  return {
    mockGetSearchAttributes,
    context,
    request,
    requestParams,
    response,
    data,
  };
}
