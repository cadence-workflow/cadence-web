import { type DomainsListingFailedCluster } from '../domains-page-error-banner/domains-page-error-banner.types';
import { type DomainData } from '../domains-page.types';

export type UseDomainsForClustersResult = {
  domains: Array<DomainData>;
  failedClusters: Array<DomainsListingFailedCluster>;
  isLoading: boolean;
};
