import { type BuildDomainClusterPathParams } from '../domain-cluster-selector.types';

/**
 * Builds the domain page path for a given domain and cluster, optionally including the domain tab segment.
 */
export default function buildDomainClusterPath({
  domain,
  cluster,
  domainTab,
}: BuildDomainClusterPathParams): string {
  const domainTabSegment = domainTab ? `/${encodeURIComponent(domainTab)}` : '';
  return `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}${domainTabSegment}`;
}
