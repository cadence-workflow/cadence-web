import { HttpResponse } from 'msw';
import { act } from 'react-dom/test-utils';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { type ListFailoverHistoryResponse } from '@/route-handlers/list-failover-history/list-failover-history.types';
import { type ClusterFailover } from '@/views/domain-page/domain-page-failovers/domain-page-failovers.types';

import * as clusterFailoverMatchesAttributeModule from '../../../helpers/cluster-failover-matches-attribute';
import useDomainFailoverHistory from '../use-domain-failover-history';

jest.mock('../../../helpers/cluster-failover-matches-attribute', () =>
  jest.fn(() => true)
);

describe(useDomainFailoverHistory.name, () => {
  it('should return loading state initially', () => {
    const { result } = setup({});

    expect(result.current.isLoading).toBe(true);
    expect(result.current.allFailoverEvents).toEqual([]);
    expect(result.current.filteredFailoverEvents).toEqual([]);
  });

  it('should return failover events when data is loaded', async () => {
    const mockFailoverEvents = createMockFailoverEvents(2);
    const { result } = setup({
      failoverResponse: {
        failoverEvents: mockFailoverEvents,
        nextPageToken: '',
      },
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allFailoverEvents).toEqual(mockFailoverEvents);
    expect(result.current.filteredFailoverEvents).toEqual(mockFailoverEvents);
  });

  it('should return empty arrays when no failover events are returned', async () => {
    const { result } = setup({
      failoverResponse: {
        failoverEvents: [],
        nextPageToken: '',
      },
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allFailoverEvents).toEqual([]);
    expect(result.current.filteredFailoverEvents).toEqual([]);
  });

  it('should filter failover events when clusterAttributeScope is provided', async () => {
    const mockFailoverEvents = createMockFailoverEvents(3);
    const clusterFailover1 = mockFailoverEvents[0].clusterFailovers[0];
    const clusterFailover2 = mockFailoverEvents[1].clusterFailovers[0];
    const clusterFailover3 = mockFailoverEvents[2].clusterFailovers[0];

    const { result, clusterFailoverMatchesAttributeSpy } = setup({
      failoverResponse: {
        failoverEvents: mockFailoverEvents,
        nextPageToken: '',
      },
      clusterAttributeScope: 'scope-0',
      clusterAttributeValue: 'name-0',
    });

    clusterFailoverMatchesAttributeSpy.mockImplementation(
      (clusterFailover: ClusterFailover) => {
        return (
          clusterFailover.clusterAttribute?.scope === 'scope-0' &&
          clusterFailover.clusterAttribute?.name === 'name-0'
        );
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allFailoverEvents).toEqual(mockFailoverEvents);
    expect(result.current.filteredFailoverEvents).toEqual([
      mockFailoverEvents[0],
    ]);

    expect(clusterFailoverMatchesAttributeSpy).toHaveBeenCalledTimes(3);
    expect(clusterFailoverMatchesAttributeSpy).toHaveBeenCalledWith(
      clusterFailover1,
      'scope-0',
      'name-0'
    );
    expect(clusterFailoverMatchesAttributeSpy).toHaveBeenCalledWith(
      clusterFailover2,
      'scope-0',
      'name-0'
    );
    expect(clusterFailoverMatchesAttributeSpy).toHaveBeenCalledWith(
      clusterFailover3,
      'scope-0',
      'name-0'
    );
  });

  it('should return all failover events when clusterAttributeScope is not provided', async () => {
    const mockFailoverEvents = createMockFailoverEvents(3);

    const { result, clusterFailoverMatchesAttributeSpy } = setup({
      failoverResponse: {
        failoverEvents: mockFailoverEvents,
        nextPageToken: '',
      },
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allFailoverEvents).toEqual(mockFailoverEvents);
    expect(result.current.filteredFailoverEvents).toEqual(mockFailoverEvents);
    expect(clusterFailoverMatchesAttributeSpy).not.toHaveBeenCalled();
  });

  it('should handle multiple pages of failover events', async () => {
    const firstPageEvents = createMockFailoverEvents(2);
    const secondPageEvents = createMockFailoverEvents(2, 2);

    let pageCount = 0;
    const { result } = setup({
      failoverResponse: () => {
        pageCount++;
        if (pageCount === 1) {
          return {
            failoverEvents: firstPageEvents,
            nextPageToken: 'token-1',
          };
        }
        return {
          failoverEvents: secondPageEvents,
          nextPageToken: '',
        };
      },
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.allFailoverEvents).toEqual(firstPageEvents);

    act(() => {
      result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.isFetchingNextPage).toBe(false);
    });

    expect(result.current.allFailoverEvents).toEqual([
      ...firstPageEvents,
      ...secondPageEvents,
    ]);
  });

  it('should handle API errors', async () => {
    const { result } = setup({ error: true });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.allFailoverEvents).toEqual([]);
    expect(result.current.filteredFailoverEvents).toEqual([]);
  });
});

function setup({
  failoverResponse,
  error = false,
  clusterAttributeScope,
  clusterAttributeValue,
}: {
  failoverResponse?:
    | ListFailoverHistoryResponse
    | (() => ListFailoverHistoryResponse);
  error?: boolean;
  clusterAttributeScope?: string;
  clusterAttributeValue?: string;
} = {}) {
  const clusterFailoverMatchesAttributeSpy = jest.spyOn(
    clusterFailoverMatchesAttributeModule,
    'default'
  );

  clusterFailoverMatchesAttributeSpy.mockReturnValue(true);

  const defaultResponse: ListFailoverHistoryResponse = {
    failoverEvents: [],
    nextPageToken: '',
  };

  return {
    ...renderHook(
      () =>
        useDomainFailoverHistory({
          domainName: 'test-domain',
          domainId: 'test-domain-id',
          cluster: 'test-cluster',
          clusterAttributeScope,
          clusterAttributeValue,
        }),
      {
        endpointsMocks: [
          {
            path: '/api/domains/:domain/:cluster/failovers',
            httpMethod: 'GET',
            mockOnce: false,
            httpResolver: async () => {
              if (error) {
                return HttpResponse.json(
                  { message: 'Failed to fetch failover history' },
                  { status: 500 }
                );
              }

              const response =
                typeof failoverResponse === 'function'
                  ? failoverResponse()
                  : failoverResponse ?? defaultResponse;

              return HttpResponse.json(response);
            },
          },
        ],
      }
    ),
    clusterFailoverMatchesAttributeSpy,
  };
}

function createMockFailoverEvents(
  count: number,
  startIndex = 0
): ListFailoverHistoryResponse['failoverEvents'] {
  return Array.from({ length: count }, (_, i) =>
    createMockFailoverEvent({
      clusterFailovers: [
        {
          clusterAttribute: {
            scope: `scope-${startIndex + i}`,
            name: `name-${startIndex + i}`,
          },
        },
      ],
    })
  );
}

function createMockFailoverEvent({
  clusterFailovers = [],
}: {
  clusterFailovers?: Array<{
    clusterAttribute: { scope: string; name: string } | null;
  }>;
}): ListFailoverHistoryResponse['failoverEvents'][number] {
  return {
    failoverType: 'FAILOVER_TYPE_GRACEFUL',
    clusterFailovers: clusterFailovers.map((cf) => ({
      clusterAttribute: cf.clusterAttribute,
    })),
  } as ListFailoverHistoryResponse['failoverEvents'][number];
}
