import { type PageQueryParamValues } from '@/hooks/use-page-query-params/use-page-query-params.types';

import type domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';

export const mockDomainsPageQueryParamsValues = {
  searchText: '',
  clusterName: undefined,
  sortColumn: undefined,
  sortOrder: undefined,
  showDeprecated: false,
} as const satisfies PageQueryParamValues<typeof domainsPageQueryParamsConfig>;
