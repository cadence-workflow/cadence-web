import { getDomainObj } from '@/views/domains-page/__fixtures__/domains';
import { type DomainData } from '@/views/domains-page/domains-page.types';
import * as describeDomainAcrossClustersModule from '../helpers/describe-domain-across-clusters';

import RedirectDomain from '../redirect-domain';

const MOCK_UNIQUE_DOMAIN = getDomainObj({
  name: 'mock-domain-unique',
  id: 'mock-domain-id-unique',
  activeClusterName: 'mock-cluster-1',
  clusters: [
    { clusterName: 'mock-cluster-1' },
    { clusterName: 'mock-cluster-2' },
  ],
});

const MOCK_SHARED_NAME_DOMAIN_1 = getDomainObj({
  name: 'mock-domain-shared-name',
  id: 'mock-domain-id-shared-name-1',
  activeClusterName: 'mock-cluster-1',
  clusters: [
    { clusterName: 'mock-cluster-1' },
    { clusterName: 'mock-cluster-2' },
  ],
});

const MOCK_SHARED_NAME_DOMAIN_2 = getDomainObj({
  name: 'mock-domain-shared-name',
  id: 'mock-domain-id-shared-name-2',
  activeClusterName: 'mock-cluster-3',
  clusters: [
    { clusterName: 'mock-cluster-3' },
    { clusterName: 'mock-cluster-4' },
  ],
});

const mockRedirect = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    // Server component stops rendering after a redirect is called
    throw new Error('Redirected');
  },
  notFound: () => {
    // Server component stops rendering after notFound is called
    throw new Error('Not found');
  },
}));
jest.mock('../helpers/describe-domain-across-clusters');

function setMockResult(
  domains: DomainData[],
  hasPermissionDenied: boolean = false,
  hasUnexpectedError: boolean = false
) {
  return jest
    .spyOn(describeDomainAcrossClustersModule, 'default')
    .mockResolvedValue({
      domains,
      hasPermissionDenied,
      hasUnexpectedError,
    });
}

describe(RedirectDomain.name, () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const redirectTests: Array<{
    name: string;
    urlParams: Array<string>;
    queryParams?: { [key: string]: string | string[] | undefined };
    domains: DomainData[];
    expectedDomainNameToSearch?: string;
    hasPermissionDenied?: boolean;
    hasUnexpectedError?: boolean;
    assertOnError?: (e: Error) => void;
    expectedRedirect?: string;
  }> = [
    {
      name: 'should redirect to domain page of active cluster',
      urlParams: ['mock-domain-unique'],
      domains: [MOCK_UNIQUE_DOMAIN],
      expectedDomainNameToSearch: 'mock-domain-unique',
      expectedRedirect: '/domains/mock-domain-unique/mock-cluster-1',
    },
    {
      name: 'should redirect to workflow page of active cluster',
      urlParams: ['mock-domain-unique', 'workflows', 'mock-wfid', 'mock-runid'],
      domains: [MOCK_UNIQUE_DOMAIN],
      expectedDomainNameToSearch: 'mock-domain-unique',
      expectedRedirect:
        '/domains/mock-domain-unique/mock-cluster-1/workflows/mock-wfid/mock-runid',
    },
    {
      name: 'should redirect with query params',
      urlParams: [
        'mock-domain-unique',
        'workflows',
        'mock-wfid',
        'mock-runid',
        'history',
      ],
      queryParams: {
        hs: 'COMPLETED',
        ht: 'ACTIVITY',
      },
      domains: [MOCK_UNIQUE_DOMAIN],
      expectedDomainNameToSearch: 'mock-domain-unique',
      expectedRedirect:
        '/domains/mock-domain-unique/mock-cluster-1/workflows/mock-wfid/mock-runid/history?hs=COMPLETED&ht=ACTIVITY',
    },
    {
      name: 'should redirect to All Domains page with search param if multiple domains exist',
      urlParams: ['mock-domain-shared-name'],
      domains: [MOCK_SHARED_NAME_DOMAIN_1, MOCK_SHARED_NAME_DOMAIN_2],
      expectedDomainNameToSearch: 'mock-domain-shared-name',
      expectedRedirect: '/domains?d=true&s=mock-domain-shared-name',
    },
    {
      name: 'should redirect to All Domains page with search param if multiple domains exist, for workflow link',
      urlParams: [
        'mock-domain-shared-name',
        'workflows',
        'mock-wfid',
        'mock-runid',
      ],
      domains: [MOCK_SHARED_NAME_DOMAIN_1, MOCK_SHARED_NAME_DOMAIN_2],
      expectedDomainNameToSearch: 'mock-domain-shared-name',
      expectedRedirect: '/domains?d=true&s=mock-domain-shared-name',
    },
    {
      name: 'should call notFound if no domain exists',
      urlParams: ['mock-domain-nonexistent'],
      domains: [],
      expectedDomainNameToSearch: 'mock-domain-nonexistent',
      assertOnError: (e) => {
        expect(e.message).toEqual('Not found');
      },
    },
    {
      name: 'should throw access denied error when domain is not found but permission was denied',
      urlParams: ['mock-domain-restricted'],
      domains: [],
      expectedDomainNameToSearch: 'mock-domain-restricted',
      hasPermissionDenied: true,
      assertOnError: (e) => {
        expect(e.message).toEqual(
          'Access denied for domain "mock-domain-restricted"'
        );
      },
    },
    {
      name: 'should throw resolve error when clusters fail unexpectedly and no domain is found',
      urlParams: ['mock-domain-unavailable'],
      domains: [],
      expectedDomainNameToSearch: 'mock-domain-unavailable',
      hasUnexpectedError: true,
      assertOnError: (e) => {
        expect(e.message).toEqual(
          'Failed to resolve domain "mock-domain-unavailable"'
        );
      },
    },
    {
      name: 'should pass the decoded domain name to describeDomainAcrossClusters',
      urlParams: ['mock-domain%3Aunique'],
      domains: [MOCK_UNIQUE_DOMAIN],
      expectedDomainNameToSearch: 'mock-domain:unique',
      expectedRedirect: '/domains/mock-domain%3Aunique/mock-cluster-1',
    },
    {
      // This never happens in practice because the router simply would not route to this component
      name: 'should throw if domain is invalid',
      urlParams: [],
      domains: [],
      assertOnError: (e) =>
        expect(e.message).toEqual('Invalid domain URL param'),
    },
  ];

  redirectTests.forEach((test) =>
    it(test.name, async () => {
      setMockResult(
        test.domains,
        test.hasPermissionDenied,
        test.hasUnexpectedError
      );

      try {
        await RedirectDomain({
          params: { domainParams: test.urlParams },
          searchParams: test.queryParams ?? undefined,
        });
      } catch (e) {
        if (e instanceof Error && e.message !== 'Redirected') {
          expect(test.assertOnError).toBeDefined();
          test.assertOnError?.(e);
        } else if (e instanceof Error && e.message === 'Redirected') {
          expect(mockRedirect).toHaveBeenCalledWith(test.expectedRedirect);
        }
      }
      if (test.expectedDomainNameToSearch) {
        expect(describeDomainAcrossClustersModule.default).toHaveBeenCalledWith(
          test.expectedDomainNameToSearch
        );
      }
    })
  );
});
