import type domainsPageQueryParamsConfig from '../config/domains-page-query-params.config';
import { type DomainsPageFilterFunc } from '../domains-page-filters/domains-page-filters.types';

const filterDomainsBySearchText: DomainsPageFilterFunc<
  typeof domainsPageQueryParamsConfig
> = (domain, queryParams) => {
  const lowerCaseSearch = queryParams.searchText?.toLowerCase();
  return (
    !lowerCaseSearch ||
    domain.id.toLowerCase() === lowerCaseSearch ||
    domain.name.toLowerCase().includes(lowerCaseSearch)
  );
};

export default filterDomainsBySearchText;
