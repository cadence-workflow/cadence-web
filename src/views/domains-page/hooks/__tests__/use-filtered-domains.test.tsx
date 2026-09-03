import React from 'react';

import { renderHook } from '@/test-utils/rtl';

import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import { getDomainObj } from '../../__fixtures__/domains';
import { mockDomainsPageQueryParamsValues } from '../../__fixtures__/domains-page-query-params';
import type domainsPageQueryParamsConfig from '../../config/domains-page-query-params.config';
import { DomainsPageContext } from '../../domains-page-context-provider/domains-page-context-provider';
import { type DomainData } from '../../domains-page.types';
import useFilteredDomains from '../use-filtered-domains';

const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

const domains: Array<DomainData> = [
  getDomainObj({ id: '1', name: 'alpha-domain' }),
  getDomainObj({ id: '2', name: 'beta-domain' }),
];

describe(useFilteredDomains.name, () => {
  it('returns all domains and the total count when nothing narrows the list', () => {
    const { result } = setup({});

    expect(result.current.filteredDomains).toHaveLength(2);
    expect(result.current.totalCount).toBe(2);
  });

  it('narrows the filtered list by search text while the total count stays the same', () => {
    const { result } = setup({ searchText: 'alpha' });

    expect(result.current.filteredDomains.map((d) => d.id)).toEqual(['1']);
    expect(result.current.totalCount).toBe(2);
  });
});

function setup(
  queryParams: Partial<
    PageQueryParamValues<typeof domainsPageQueryParamsConfig>
  >
) {
  mockUsePageQueryParams.mockReturnValue([
    { ...mockDomainsPageQueryParamsValues, ...queryParams },
    jest.fn(),
  ]);

  return renderHook(() => useFilteredDomains(domains), undefined, {
    wrapper: ({ children }) => (
      <DomainsPageContext.Provider
        value={{ pageConfig: { CLUSTERS_PUBLIC: [] } }}
      >
        {children}
      </DomainsPageContext.Provider>
    ),
  });
}
