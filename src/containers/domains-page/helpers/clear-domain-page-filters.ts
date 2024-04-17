import {
  PageQueryParamSetter,
  PageQueryParams,
} from '@/hooks/use-page-query-params/use-page-query-params.types';
import domainPageFilters from '../config/domains-page-filters.config';
import { DomainPageFilters } from '../domains-page-filters/domains-page-filters.types';

function clearDomainPageFilters<P extends PageQueryParams>(
  setQueryParams: PageQueryParamSetter<P>,
  filters: DomainPageFilters = domainPageFilters
) {
  const emptyFiltersKeyValueEntries = filters.map((f) => [f.id, undefined]);
  const emptyValuesObj = Object.fromEntries(emptyFiltersKeyValueEntries);
  setQueryParams(emptyValuesObj);
}
export default clearDomainPageFilters;
