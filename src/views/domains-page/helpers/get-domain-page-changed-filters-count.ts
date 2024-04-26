import {
  PageQueryParamValues,
  PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import domainPageFilters from '../config/domains-page-filters.config';
import domainPageQueryParamsConfig from '../config/domains-page-query-params.config';
import { DomainPageFilters } from '../domains-page-filters/domains-page-filters.types';

function getDomainsPageChangedFiltersCount(
  queryParams: PageQueryParamValues<PageQueryParams>,
  queryParamsConfig: PageQueryParams = domainPageQueryParamsConfig,
  filters: DomainPageFilters = domainPageFilters
) {
  const configsByKey = Object.fromEntries(
    queryParamsConfig.map((c) => [c.key, c])
  );
  return filters.reduce((result, filter) => {
    const filterValue = queryParams[filter.id];
    const filterDefaultValue = configsByKey[filter.id]?.defaultValue;
    return filterValue === filterDefaultValue ? result : result + 1;
  }, 0);
}
export default getDomainsPageChangedFiltersCount;
