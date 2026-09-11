import React from 'react';

import { renderHook } from '@/test-utils/rtl';

import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import { getDomainObj } from '../../__fixtures__/domains';
import { mockDomainsPageQueryParamsValues } from '../../__fixtures__/domains-page-query-params';
import domainsPageFiltersConfig from '../../config/domains-page-filters.config';
import type domainsPageQueryParamsConfig from '../../config/domains-page-query-params.config';
import { DomainsPageContext } from '../../domains-page-context-provider/domains-page-context-provider';
import { type DomainsPageContextType } from '../../domains-page-context-provider/domains-page-context-provider.types';
import {
  type DomainData,
  type FilteredDomains,
} from '../../domains-page.types';
import getFilteredDomains from '../../helpers/get-filtered-domains';
import useFilteredDomains from '../use-filtered-domains';

jest.mock('../../config/domains-page-filters.config', () => [
  { filterFunc: () => true },
]);

jest.mock('../../helpers/get-filtered-domains', () => jest.fn());

const mockUsePageQueryParams = jest.fn();
jest.mock('@/hooks/use-page-query-params/use-page-query-params', () => ({
  __esModule: true,
  default: (...args: Array<unknown>) => mockUsePageQueryParams(...args),
}));

const mockGetFilteredDomains = jest.mocked(getFilteredDomains);

const mockDomains: Array<DomainData> = [
  getDomainObj({ id: '1', name: 'alpha-domain' }),
  getDomainObj({ id: '2', name: 'beta-domain' }),
];

const mockPageCtx: DomainsPageContextType = {
  pageConfig: {
    CLUSTERS_PUBLIC: [
      { clusterName: 'cluster-a' },
      { clusterName: 'cluster-b' },
    ],
  },
};

const mockFilteredDomainsResult: FilteredDomains = {
  filteredDomains: [mockDomains[0]],
  totalCount: 2,
};

describe(useFilteredDomains.name, () => {
  it('calls getFilteredDomains with the domains, query params, page context and filters config', () => {
    setup({ queryParams: { searchText: 'alpha', showDeprecated: true } });

    expect(mockGetFilteredDomains).toHaveBeenCalledWith({
      domains: mockDomains,
      queryParams: {
        ...mockDomainsPageQueryParamsValues,
        searchText: 'alpha',
        showDeprecated: true,
      },
      pageCtx: mockPageCtx,
      filtersConfig: domainsPageFiltersConfig,
    });
  });

  it('returns the result from getFilteredDomains', () => {
    const { result } = setup({});

    expect(result.current).toEqual(mockFilteredDomainsResult);
  });

  it('recomputes when the domains change', () => {
    const { rerender } = setup({});
    const newDomains = [getDomainObj({ id: '3', name: 'gamma-domain' })];

    rerender({ domains: newDomains });

    expect(mockGetFilteredDomains).toHaveBeenLastCalledWith(
      expect.objectContaining({ domains: newDomains })
    );
  });
});

function setup({
  domains = mockDomains,
  queryParams,
}: {
  domains?: Array<DomainData>;
  queryParams?: Partial<
    PageQueryParamValues<typeof domainsPageQueryParamsConfig>
  >;
}) {
  mockUsePageQueryParams.mockReturnValue([
    { ...mockDomainsPageQueryParamsValues, ...queryParams },
    jest.fn(),
  ]);
  mockGetFilteredDomains.mockReturnValue(mockFilteredDomainsResult);

  return renderHook(
    (props?: { domains: Array<DomainData> }) =>
      useFilteredDomains(props?.domains ?? domains),
    undefined,
    {
      initialProps: { domains },
      wrapper: ({ children }) => (
        <DomainsPageContext.Provider value={mockPageCtx}>
          {children}
        </DomainsPageContext.Provider>
      ),
    }
  );
}
