export type Props = {
  failedClusters: DomainsListingFailedCluster[];
};

export type DomainsListingFailedCluster = {
  clusterName: string;
  httpStatus: number;
};
