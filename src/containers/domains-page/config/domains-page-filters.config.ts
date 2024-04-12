import { DomainPageFilters } from "../domains-page-filters/domains-page-filters.types";
import DomainsPageFiltersClusterName from "../domains-page-filters-cluster-name/domains-page-filters-cluster-name";

const domainPageFilters = [
    {
        id: 'clusterName',
        renderFilter: DomainsPageFiltersClusterName,
    }
] as const satisfies DomainPageFilters;

export default domainPageFilters;