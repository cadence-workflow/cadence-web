import { renderHook, waitFor } from '@/test-utils/rtl';

import useSuspenseConfigValue from '@/hooks/use-config-value/use-suspense-config-value';
import { type ListDomainsResponse } from '@/route-handlers/list-domains/list-domains.types';
import { RequestError } from '@/utils/request/request-error';

import { getDomainObj } from '../../__fixtures__/domains';

import useListDomains from '../use-list-domains';

jest.mock('@/hooks/use-config-value/use-suspense-config-value');
jest.mock('@/utils/request');

const mockUseSuspenseConfigValue =
  useSuspenseConfigValue as jest.MockedFunction<any>;

const mockClusters = [
  { clusterName: 'cluster-a' },
  { clusterName: 'cluster-b' },
];

const mockDomainsClusterA: ListDomainsResponse = {
  domains: [
    getDomainObj({ id: '1', name: 'alpha-domain', activeClusterName: 'cluster-a' }),
    getDomainObj({ id: '2', name: 'charlie-domain', activeClusterName: 'cluster-a' }),
  ],
  nextPage: '',
};

const mockDomainsClusterB: ListDomainsResponse = {
  domains: [
    getDomainObj({ id: '3', name: 'bravo-domain', activeClusterName: 'cluster-b' }),
  ],
  nextPage: '',
};

const mockRequest = jest.requireMock('@/utils/request');

describe(useListDomains.name, () => {
  beforeEach(() => {
    mockUseSuspenseConfigValue.mockReturnValue({ data: mockClusters });
    mockRequest.default.mockImplementation((url: string) => {
      if (url.includes('cluster-a')) {
        return Promise.resolve({ json: () => mockDomainsClusterA });
      }
      if (url.includes('cluster-b')) {
        return Promise.resolve({ json: () => mockDomainsClusterB });
      }
      return Promise.reject(new Error('Unknown cluster'));
    });
  });

  it('returns merged and deduplicated domains from all clusters', async () => {
    const { result } = renderHook(() => useListDomains());

    await waitFor(() => {
      expect(result.current.data.length).toBe(3);
    });

    const names = result.current.data.map((d) => d.name);
    expect(names).toContain('alpha-domain');
    expect(names).toContain('bravo-domain');
    expect(names).toContain('charlie-domain');
  });

  it('deduplicates domains that appear in multiple clusters', async () => {
    const sharedDomain = getDomainObj({
      id: '1',
      name: 'alpha-domain',
      activeClusterName: 'cluster-a',
    });

    mockRequest.default.mockImplementation((url: string) => {
      if (url.includes('cluster-a')) {
        return Promise.resolve({
          json: () => ({ domains: [sharedDomain], nextPage: '' }),
        });
      }
      if (url.includes('cluster-b')) {
        return Promise.resolve({
          json: () => ({ domains: [sharedDomain], nextPage: '' }),
        });
      }
      return Promise.reject(new Error('Unknown cluster'));
    });

    const { result } = renderHook(() => useListDomains());

    await waitFor(() => {
      expect(result.current.data.length).toBe(1);
    });
  });

  it('reports failed clusters when a request errors', async () => {
    mockRequest.default.mockImplementation((url: string) => {
      if (url.includes('cluster-a')) {
        return Promise.resolve({ json: () => mockDomainsClusterA });
      }
      return Promise.reject(new RequestError('Server error', url, 503));
    });

    const { result } = renderHook(() => useListDomains());

    await waitFor(() => {
      expect(result.current.failedClusters).toEqual([
        { clusterName: 'cluster-b', httpStatus: 503 },
      ]);
    });

    expect(result.current.data.length).toBe(2);
  });

  it('sets httpStatus to undefined for non-RequestError failures', async () => {
    mockRequest.default.mockImplementation((url: string) => {
      if (url.includes('cluster-a')) {
        return Promise.resolve({ json: () => mockDomainsClusterA });
      }
      return Promise.reject(new Error('Network failure'));
    });

    const { result } = renderHook(() => useListDomains());

    await waitFor(() => {
      expect(result.current.failedClusters).toEqual([
        { clusterName: 'cluster-b', httpStatus: undefined },
      ]);
    });
  });

  it('returns empty data and all failed clusters when all requests fail', async () => {
    mockRequest.default.mockImplementation((url: string) => {
      return Promise.reject(new RequestError('Server error', url, 500));
    });

    const { result } = renderHook(() => useListDomains());

    await waitFor(() => {
      expect(result.current.failedClusters.length).toBe(2);
    });

    expect(result.current.data).toEqual([]);
  });
});
