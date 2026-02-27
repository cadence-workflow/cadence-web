import type { DescribeClusterResponse } from '@/route-handlers/describe-cluster/describe-cluster.types';

export default function isClusterAdvancedVisibilityEnabled(
  cluster?: DescribeClusterResponse
) {
  if (!cluster) return false;
  const clusterVisibilityFeatures =
    cluster.persistenceInfo?.visibilityStore?.features || [];

  const advancedVisibilityEnabledFeature = clusterVisibilityFeatures.find(
    ({ key }) => key === 'advancedVisibilityEnabled'
  );

  return advancedVisibilityEnabledFeature?.enabled ?? false;
}
