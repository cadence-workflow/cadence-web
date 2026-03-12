import { type BuildWorkflowPageClusterPathParams } from '../workflow-page-header-cluster-selector.types';

/**
 * Builds the workflow page path for a given domain and cluster, optionally including the workflow tab segment.
 */
export default function buildWorkflowPageClusterPath({
  domain,
  cluster,
  workflowId,
  runId,
  workflowTab,
}: BuildWorkflowPageClusterPathParams): string {
  const workflowTabSegment = workflowTab
    ? `/${decodeURIComponent(workflowTab)}`
    : '';
  return `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/workflows/${encodeURIComponent(workflowId)}/${encodeURIComponent(runId)}${workflowTabSegment}`;
}
