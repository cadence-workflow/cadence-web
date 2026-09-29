import { getDomainObj } from '../../__fixtures__/domains';
import { mockDomainsPageFilterRules } from '../../__fixtures__/domains-page-filters-config';
import {
  mockQueryParamsValues,
  type mockQueryParamsConfig,
} from '../../__fixtures__/domains-page-mock-query-params-config';
import { type DomainsPageContextType } from '../../domains-page-context-provider/domains-page-context-provider.types';
import { type DomainData } from '../../domains-page.types';
import getFilteredDomains from '../get-filtered-domains';

const pageCtx = {
  mockContextValue: 'mock',
} as unknown as DomainsPageContextType;

describe(getFilteredDomains.name, () => {
  it('removes domains failing a deducting rule from both the list and the total', () => {
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
      queryParams: mockQueryParamsValues,
      pageCtx,
      filterRules: mockDomainsPageFilterRules,
    });

    expect(result.filteredDomains.map((d) => d.id)).toEqual(['1']);
    expect(result.totalCount).toBe(1);
  });

  it('keeps domains in both the list and the total when the deducting rule passes', () => {
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
      queryParams: { ...mockQueryParamsValues, mockShowDeprecated: true },
      pageCtx,
      filterRules: mockDomainsPageFilterRules,
    });

    expect(result.filteredDomains.map((d) => d.id)).toEqual(['1', '2']);
    expect(result.totalCount).toBe(2);
  });

  it('removes domains failing a narrowing rule from the list only', () => {
    const domains: Array<DomainData> = [
      getDomainObj({ id: '1', name: 'alpha-domain' }),
      getDomainObj({ id: '2', name: 'beta-domain' }),
    ];

    const result = getFilteredDomains({
      domains,
      queryParams: { ...mockQueryParamsValues, mockNameFilter: 'alpha' },
      pageCtx,
      filterRules: mockDomainsPageFilterRules,
    });

    expect(result.filteredDomains.map((d) => d.id)).toEqual(['1']);
    expect(result.totalCount).toBe(2);
  });

  it('combines narrowing and deducting rules', () => {
    const domains: Array<DomainData> = [
      getDomainObj({ id: '1', name: 'alpha-domain' }),
      getDomainObj({
        id: '2',
        name: 'alpha-deprecated-domain',
        status: 'DOMAIN_STATUS_DEPRECATED',
      }),
      getDomainObj({ id: '3', name: 'beta-domain' }),
    ];

    const hiddenDeprecated = getFilteredDomains({
      domains,
      queryParams: { ...mockQueryParamsValues, mockNameFilter: 'alpha' },
      pageCtx,
      filterRules: mockDomainsPageFilterRules,
    });
    expect(hiddenDeprecated.filteredDomains.map((d) => d.id)).toEqual(['1']);
    expect(hiddenDeprecated.totalCount).toBe(2);

    const shownDeprecated = getFilteredDomains({
      domains,
      queryParams: {
        ...mockQueryParamsValues,
        mockNameFilter: 'alpha',
        mockShowDeprecated: true,
      },
      pageCtx,
      filterRules: mockDomainsPageFilterRules,
    });
    expect(shownDeprecated.filteredDomains.map((d) => d.id)).toEqual([
      '1',
      '2',
    ]);
    expect(shownDeprecated.totalCount).toBe(3);
  });

  it('counts and returns every domain when there are no rules', () => {
    const domains: Array<DomainData> = [
      getDomainObj({ id: '1', name: 'alpha-domain' }),
      getDomainObj({
        id: '2',
        name: 'beta-domain',
        status: 'DOMAIN_STATUS_DEPRECATED',
      }),
    ];

    const result = getFilteredDomains<typeof mockQueryParamsConfig>({
      domains,
      queryParams: mockQueryParamsValues,
      pageCtx,
      filterRules: [],
    });

    expect(result.filteredDomains.map((d) => d.id)).toEqual(['1', '2']);
    expect(result.totalCount).toBe(2);
  });

  it('passes the domain, query params and page context to the rules', () => {
    const domains: Array<DomainData> = [
      getDomainObj({ id: '1', name: 'alpha-domain' }),
    ];
    const narrowingFunc = jest.fn(() => true);
    const deductingFunc = jest.fn(() => true);

    getFilteredDomains<typeof mockQueryParamsConfig>({
      domains,
      queryParams: mockQueryParamsValues,
      pageCtx,
      filterRules: [
        { filterFunc: narrowingFunc },
        { filterFunc: deductingFunc, deductFilteredResultFromTotal: true },
      ],
    });

    expect(narrowingFunc).toHaveBeenCalledWith(
      domains[0],
      mockQueryParamsValues,
      pageCtx
    );
    expect(deductingFunc).toHaveBeenCalledWith(
      domains[0],
      mockQueryParamsValues,
      pageCtx
    );
  });
});
