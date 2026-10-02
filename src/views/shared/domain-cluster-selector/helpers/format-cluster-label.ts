import type { FormatClusterLabel } from '@/views/shared/domain-cluster-selector/domain-cluster-selector.types';

const formatClusterLabel: FormatClusterLabel = (
  clusterName,
  replicationStatusLabel
) =>
  replicationStatusLabel
    ? `${clusterName} (${replicationStatusLabel})`
    : clusterName;

export default formatClusterLabel;
