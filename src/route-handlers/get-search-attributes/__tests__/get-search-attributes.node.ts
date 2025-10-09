import { NextRequest } from 'next/server';

import { IndexedValueType } from '@/__generated__/proto-ts/uber/cadence/api/v1/IndexedValueType';

import getSearchAttributes from '../get-search-attributes';
import { SYSTEM_SEARCH_ATTRIBUTES } from '../get-search-attributes.constants';
import {
  type Context,
  type RequestParams,
} from '../get-search-attributes.types';

describe('getSearchAttributes', () => {
  function setup() {
    const mockGetSearchAttributes = jest.fn();
    const mockGrpcClusterMethods = {
      getSearchAttributes: mockGetSearchAttributes,
    } as any;

    const context: Context = {
      grpcClusterMethods: mockGrpcClusterMethods,
    };

    const request = new NextRequest(
      'http://localhost:3000/api/clusters/test-cluster/search-attributes'
    );
    const requestParams: RequestParams = {
      params: { cluster: 'test-cluster' },
    };

    return {
      mockGetSearchAttributes,
      context,
      request,
      requestParams,
    };
  }

  it('should return response with all attributes by default', async () => {
    const { mockGetSearchAttributes, context, request, requestParams } =
      setup();

    const mockResponse = {
      keys: {
        WorkflowType: IndexedValueType.INDEXED_VALUE_TYPE_KEYWORD,
        CloseTime: IndexedValueType.INDEXED_VALUE_TYPE_DATETIME,
        IsCron: IndexedValueType.INDEXED_VALUE_TYPE_BOOL,
        CustomAttribute: IndexedValueType.INDEXED_VALUE_TYPE_STRING,
      },
    };

    mockGetSearchAttributes.mockResolvedValue(mockResponse);

    const response = await getSearchAttributes(request, requestParams, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('keys');
    expect(data).toHaveProperty('category', 'all');
    expect(Object.keys(data.keys)).toHaveLength(4);
    expect(mockGetSearchAttributes).toHaveBeenCalledWith({});
  });

  it('should return RPC response with all attribute types', async () => {
    const { mockGetSearchAttributes, context, request, requestParams } =
      setup();

    const mockResponse = {
      keys: {
        CloseTime: IndexedValueType.INDEXED_VALUE_TYPE_DATETIME,
        StartTime: IndexedValueType.INDEXED_VALUE_TYPE_DATETIME,
        WorkflowType: IndexedValueType.INDEXED_VALUE_TYPE_KEYWORD,
        WorkflowID: IndexedValueType.INDEXED_VALUE_TYPE_STRING,
        IsCron: IndexedValueType.INDEXED_VALUE_TYPE_BOOL,
        HistoryLength: IndexedValueType.INDEXED_VALUE_TYPE_INT,
        Score: IndexedValueType.INDEXED_VALUE_TYPE_DOUBLE,
      },
    };

    mockGetSearchAttributes.mockResolvedValue(mockResponse);

    const response = await getSearchAttributes(request, requestParams, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('keys');
    expect(data).toHaveProperty('category', 'all');
    expect(data.keys).toHaveProperty(
      'CloseTime',
      IndexedValueType.INDEXED_VALUE_TYPE_DATETIME
    );
    expect(data.keys).toHaveProperty(
      'WorkflowType',
      IndexedValueType.INDEXED_VALUE_TYPE_KEYWORD
    );
    expect(data.keys).toHaveProperty(
      'IsCron',
      IndexedValueType.INDEXED_VALUE_TYPE_BOOL
    );
    expect(data.keys).toHaveProperty(
      'HistoryLength',
      IndexedValueType.INDEXED_VALUE_TYPE_INT
    );
    expect(data.keys).toHaveProperty(
      'Score',
      IndexedValueType.INDEXED_VALUE_TYPE_DOUBLE
    );
  });

  it('should handle RPC errors gracefully', async () => {
    const { mockGetSearchAttributes, context, request, requestParams } =
      setup();

    const rpcError = new Error('RPC connection failed');
    mockGetSearchAttributes.mockRejectedValue(rpcError);

    const response = await getSearchAttributes(request, requestParams, context);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('Failed to fetch search attributes');
    expect(mockGetSearchAttributes).toHaveBeenCalledWith({});
  });

  it('should handle empty search attributes response', async () => {
    const { mockGetSearchAttributes, context, request, requestParams } =
      setup();

    const mockResponse = { keys: {} };
    mockGetSearchAttributes.mockResolvedValue(mockResponse);

    const response = await getSearchAttributes(request, requestParams, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('keys');
    expect(data).toHaveProperty('category', 'all');
    expect(data.keys).toEqual({});
  });

  it('should pass through RPC response structure with additional fields', async () => {
    const { mockGetSearchAttributes, context, request, requestParams } =
      setup();

    const mockResponse = {
      keys: {
        CustomAttribute1: IndexedValueType.INDEXED_VALUE_TYPE_STRING,
        CustomAttribute2: IndexedValueType.INDEXED_VALUE_TYPE_DATETIME,
      },
      // Any additional fields that might be in the RPC response
      metadata: { version: '1.0' },
    };

    mockGetSearchAttributes.mockResolvedValue(mockResponse);

    const response = await getSearchAttributes(request, requestParams, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('keys');
    expect(data).toHaveProperty('category', 'all');
    // Verify the exact structure is preserved
    expect(data.keys).toEqual(mockResponse.keys);
    expect(data.metadata).toEqual(mockResponse.metadata);
  });

  it('should call RPC method with empty payload', async () => {
    const { mockGetSearchAttributes, context, request, requestParams } =
      setup();

    const mockResponse = { keys: {} };
    mockGetSearchAttributes.mockResolvedValue(mockResponse);

    await getSearchAttributes(request, requestParams, context);

    expect(mockGetSearchAttributes).toHaveBeenCalledTimes(1);
    expect(mockGetSearchAttributes).toHaveBeenCalledWith({});
  });

  it('should filter system attributes when category=system', async () => {
    const { mockGetSearchAttributes, context, requestParams } = setup();

    const request = new NextRequest(
      'http://localhost:3000/api/clusters/test-cluster/search-attributes?category=system'
    );

    const mockResponse = {
      keys: {
        WorkflowType: IndexedValueType.INDEXED_VALUE_TYPE_KEYWORD,
        CloseTime: IndexedValueType.INDEXED_VALUE_TYPE_DATETIME,
        IsCron: IndexedValueType.INDEXED_VALUE_TYPE_BOOL,
        CustomAttribute: IndexedValueType.INDEXED_VALUE_TYPE_STRING,
      },
    };

    mockGetSearchAttributes.mockResolvedValue(mockResponse);

    const response = await getSearchAttributes(request, requestParams, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.category).toBe('system');
    expect(Object.keys(data.keys)).toHaveLength(3); // Only system attributes
    expect(Object.keys(data.keys)).toEqual(
      expect.arrayContaining(['WorkflowType', 'CloseTime', 'IsCron'])
    );
    expect(Object.keys(data.keys)).not.toContain('CustomAttribute');
  });

  it('should filter custom attributes when category=custom', async () => {
    const { mockGetSearchAttributes, context, requestParams } = setup();

    const request = new NextRequest(
      'http://localhost:3000/api/clusters/test-cluster/search-attributes?category=custom'
    );

    const mockResponse = {
      keys: {
        WorkflowType: IndexedValueType.INDEXED_VALUE_TYPE_KEYWORD,
        CloseTime: IndexedValueType.INDEXED_VALUE_TYPE_DATETIME,
        IsCron: IndexedValueType.INDEXED_VALUE_TYPE_BOOL,
        CustomAttribute: IndexedValueType.INDEXED_VALUE_TYPE_STRING,
        AnotherCustom: IndexedValueType.INDEXED_VALUE_TYPE_INT,
      },
    };

    mockGetSearchAttributes.mockResolvedValue(mockResponse);

    const response = await getSearchAttributes(request, requestParams, context);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.category).toBe('custom');
    expect(Object.keys(data.keys)).toHaveLength(2); // Only custom attributes
    expect(Object.keys(data.keys)).toEqual(
      expect.arrayContaining(['CustomAttribute', 'AnotherCustom'])
    );
    expect(Object.keys(data.keys)).not.toContain('WorkflowType');
  });
});
