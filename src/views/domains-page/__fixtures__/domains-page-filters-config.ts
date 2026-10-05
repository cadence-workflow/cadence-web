import { type DomainsPageFilterRule } from '../domains-page-filters/domains-page-filters.types';

import { type mockQueryParamsConfig } from './domains-page-mock-query-params-config';

export const mockDomainsPageFilterRules: ReadonlyArray<
  DomainsPageFilterRule<typeof mockQueryParamsConfig>
> = [
  {
    filterFunc: (domain, queryParams) =>
      !queryParams.mockNameFilter ||
      domain.name.includes(queryParams.mockNameFilter),
  },
  {
    filterFunc: (domain, queryParams) =>
      queryParams.mockShowDeprecated
        ? true
        : domain.status === 'DOMAIN_STATUS_REGISTERED',
    deductFilteredResultFromTotal: true,
  },
];
