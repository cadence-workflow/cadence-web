import { PRIMARY_CLUSTER_SCOPE } from '../domain-page-failovers/domain-page-failovers.constants';
import { type ClusterFailover } from '../domain-page-failovers/domain-page-failovers.types';

export default function clusterFailoverMatchesAttribute(
  clusterFailover: ClusterFailover,
  scope?: string,
  value?: string
) {
  const attribute = clusterFailover.clusterAttribute;
  if (attribute === null) return scope === PRIMARY_CLUSTER_SCOPE;

  const scopeMatches = attribute.scope === scope;
  if (!value) return scopeMatches;

  return scopeMatches && attribute.name === value;
}
