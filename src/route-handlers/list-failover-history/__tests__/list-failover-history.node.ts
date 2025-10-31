import { NextRequest } from 'next/server';

import type { ListFailoverHistoryResponse as OriginalListFailoverHistoryResponse } from '@/__generated__/proto-ts/uber/cadence/api/v1/ListFailoverHistoryResponse';
import { GRPCError } from '@/utils/grpc/grpc-error';
import { mockGrpcClusterMethods } from '@/utils/route-handlers-middleware/middlewares/__mocks__/grpc-cluster-methods';

import { listFailoverHistory } from '../list-failover-history';
import {
  type Context,
  type RequestParams,
} from '../list-failover-history.types';

beforeEach(() => {
  jest.resetAllMocks();
});

describe(listFailoverHistory.name, () => {
  it('calls listFailoverHistory with correct parameters and returns valid response', async () => {
    const { res, mockListFailoverHistory, mockSuccessResponse } = await setup({
      domainId: 'test-domain-id',
    });

    expect(mockListFailoverHistory).toHaveBeenCalledWith({
      filters: {
        domainId: 'test-domain-id',
      },
      pagination: {
        nextPageToken: undefined,
      },
    });
    const responseJson = await res.json();
    expect(responseJson).toEqual(mockSuccessResponse);
    expect(res.status).toEqual(200);
  });

  it('calls listFailoverHistory with nextPage token when provided', async () => {
    const { res, mockListFailoverHistory } = await setup({
      domainId: 'test-domain-id',
      nextPage: 'token-123',
    });

    expect(mockListFailoverHistory).toHaveBeenCalledWith({
      filters: {
        domainId: 'test-domain-id',
      },
      pagination: {
        nextPageToken: 'token-123',
      },
    });
    const responseJson = await res.json();
    expect(responseJson.nextPageToken).toEqual('next-token-456');
    expect(res.status).toEqual(200);
  });

  it('returns 400 when query parameters are invalid', async () => {
    const { res } = await setup({
      skipDomainId: true,
    });

    expect(res.status).toEqual(400);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Invalid argument(s) for fetching failover history',
        validationErrors: expect.arrayContaining([
          expect.objectContaining({
            code: 'invalid_type',
            path: ['domainId'],
          }),
        ]),
      })
    );
  });

  it('returns an error when listFailoverHistory errors out with GRPCError', async () => {
    const { res, mockListFailoverHistory } = await setup({
      domainId: 'test-domain-id',
      error: new GRPCError('Failed to fetch failover history'),
    });

    expect(mockListFailoverHistory).toHaveBeenCalled();
    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Failed to fetch failover history',
      })
    );
  });

  it('returns an error when listFailoverHistory errors out with generic error', async () => {
    const { res, mockListFailoverHistory } = await setup({
      domainId: 'test-domain-id',
      error: new Error('Network error'),
    });

    expect(mockListFailoverHistory).toHaveBeenCalled();
    expect(res.status).toEqual(500);
    const responseJson = await res.json();
    expect(responseJson).toEqual(
      expect.objectContaining({
        message: 'Error fetching failover history',
      })
    );
  });
});

async function setup({
  domainId,
  nextPage,
  error,
  skipDomainId,
}: {
  domainId?: string;
  nextPage?: string;
  error?: Error;
  skipDomainId?: boolean;
}) {
  const mockSuccessResponse: OriginalListFailoverHistoryResponse = {
    failoverEvents: [],
    nextPageToken: nextPage ? 'next-token-456' : '',
  };

  const mockListFailoverHistory = jest
    .spyOn(mockGrpcClusterMethods, 'listFailoverHistory')
    .mockImplementationOnce(async () => {
      if (error) {
        throw error;
      }
      return mockSuccessResponse;
    });

  const queryParams = new URLSearchParams();
  if (!skipDomainId && domainId !== undefined) {
    queryParams.append('domainId', domainId);
  }
  if (nextPage !== undefined) {
    queryParams.append('nextPage', nextPage);
  }

  const url = `http://localhost/api/clusters/test-cluster/domains/test-domain/failover-history?${queryParams.toString()}`;

  const res = await listFailoverHistory(
    new NextRequest(url, {
      method: 'GET',
    }),
    {
      params: {
        domain: 'test-domain',
        cluster: 'test-cluster',
      },
    } as RequestParams,
    {
      grpcClusterMethods: mockGrpcClusterMethods,
    } as Context
  );

  return { res, mockListFailoverHistory, mockSuccessResponse };
}
