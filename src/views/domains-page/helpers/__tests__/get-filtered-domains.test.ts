import { getDomainObj } from '../../__fixtures__/domains';
import { mockDomainsPageQueryParamsValues } from '../../__fixtures__/domains-page-query-params';
import { type DomainsPageContextType } from '../../domains-page-context-provider/domains-page-context-provider.types';
import { type DomainData } from '../../domains-page.types';
import getFilteredDomains from '../get-filtered-domains';

const pageCtx: DomainsPageContextType = { pageConfig: { CLUSTERS_PUBLIC: [] } };

describe(getFilteredDomains.name, () => {
  it('excludes deprecated domains from both the list and the total by default', () => {
    const domains: Array<DomainData> = [
      getDomainObj({ id: '1', name: 'alpha-domain' }),
      getDomainObj({
        id: '2',
        name: 'beta-domain',
        status: 'DOMAIN_STATUS_DEPRECATED',
      }),
    ];

    const result = getFilteredDomains({
      domains,
      queryParams: mockDomainsPageQueryParamsValues,
      pageCtx,
    });

    expect(result.filteredDomains.map((d) => d.id)).toEqual(['1']);
    expect(result.totalCount).toBe(1);
  });

  it('includes deprecated domains in both the list and the total when showDeprecated is true', () => {
    const domains: Array<DomainData> = [
      getDomainObj({ id: '1', name: 'alpha-domain' }),
      getDomainObj({
        id: '2',
        name: 'beta-domain',
        status: 'DOMAIN_STATUS_DEPRECATED',
      }),
    ];

    const result = getFilteredDomains({
      domains,
      queryParams: {
        ...mockDomainsPageQueryParamsValues,
        showDeprecated: true,
      },
      pageCtx,
    });

    expect(result.filteredDomains.map((d) => d.id).sort()).toEqual(['1', '2']);
    expect(result.totalCount).toBe(2);
  });

  it('narrows the list by search text without changing the total', () => {
    const domains: Array<DomainData> = [
      getDomainObj({ id: '1', name: 'alpha-domain' }),
      getDomainObj({ id: '2', name: 'beta-domain' }),
    ];

    const result = getFilteredDomains({
      domains,
      queryParams: { ...mockDomainsPageQueryParamsValues, searchText: 'alpha' },
      pageCtx,
    });

    expect(result.filteredDomains.map((d) => d.id)).toEqual(['1']);
    expect(result.totalCount).toBe(2);
  });

  it('matches search text against an exact (case-insensitive) id', () => {
    const domains: Array<DomainData> = [
      getDomainObj({ id: 'abc123', name: 'zzz-domain' }),
    ];

    const exactMatch = getFilteredDomains({
      domains,
      queryParams: {
        ...mockDomainsPageQueryParamsValues,
        searchText: 'ABC123',
      },
      pageCtx,
    });
    expect(exactMatch.filteredDomains.map((d) => d.id)).toEqual(['abc123']);

    const partialMatch = getFilteredDomains({
      domains,
      queryParams: { ...mockDomainsPageQueryParamsValues, searchText: 'abc' },
      pageCtx,
    });
    expect(partialMatch.filteredDomains).toEqual([]);
  });

  it('narrows the list by clusterName without changing the total', () => {
    const domains: Array<DomainData> = [
      getDomainObj({
        id: '1',
        name: 'alpha-domain',
        clusters: [{ clusterName: 'clusterA' }],
      }),
      getDomainObj({
        id: '2',
        name: 'beta-domain',
        clusters: [{ clusterName: 'clusterB' }],
      }),
    ];

    const result = getFilteredDomains({
      domains,
      queryParams: {
        ...mockDomainsPageQueryParamsValues,
        clusterName: 'clusterA',
      },
      pageCtx,
    });

    expect(result.filteredDomains.map((d) => d.id)).toEqual(['1']);
    expect(result.totalCount).toBe(2);
  });

  it('combines search text with the deprecated scope filter', () => {
    const domains: Array<DomainData> = [
      getDomainObj({ id: '1', name: 'alpha-domain' }),
      getDomainObj({
        id: '2',
        name: 'alpha-deprecated-domain',
        status: 'DOMAIN_STATUS_DEPRECATED',
      }),
    ];

    const hiddenDeprecated = getFilteredDomains({
      domains,
      queryParams: { ...mockDomainsPageQueryParamsValues, searchText: 'alpha' },
      pageCtx,
    });
    expect(hiddenDeprecated.filteredDomains.map((d) => d.id)).toEqual(['1']);
    expect(hiddenDeprecated.totalCount).toBe(1);

    const shownDeprecated = getFilteredDomains({
      domains,
      queryParams: {
        ...mockDomainsPageQueryParamsValues,
        searchText: 'alpha',
        showDeprecated: true,
      },
      pageCtx,
    });
    expect(shownDeprecated.filteredDomains.map((d) => d.id).sort()).toEqual([
      '1',
      '2',
    ]);
    expect(shownDeprecated.totalCount).toBe(2);
  });
});
