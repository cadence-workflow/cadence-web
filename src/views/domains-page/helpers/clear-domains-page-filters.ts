import {
  PageQueryParamSetter,
  PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import domainsPageFiltersConfig from '../config/domains-page-filters.config';
import { DomainsPageFiltersConfig } from '../domains-page-filters/domains-page-filters.types';

function clearDomainsPageFilters<P extends PageQueryParams>(
  setQueryParams: PageQueryParamSetter<P>,
  filters: DomainsPageFiltersConfig = domainsPageFiltersConfig
) {
  const emptyFiltersKeyValueEntries = filters.map((f) => [f.id, undefined]);
  const emptyValuesObj = Object.fromEntries(emptyFiltersKeyValueEntries);
  setQueryParams(emptyValuesObj);
}
export default clearDomainsPageFilters;
