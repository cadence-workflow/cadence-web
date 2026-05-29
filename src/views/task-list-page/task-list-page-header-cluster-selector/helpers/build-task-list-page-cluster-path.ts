import { type BuildTaskListPageClusterPathParams } from '../task-list-page-header-cluster-selector.types';

export default function buildTaskListPageClusterPath({
  domain,
  cluster,
  taskListName,
}: BuildTaskListPageClusterPathParams): string {
  return `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/task-lists/${encodeURIComponent(taskListName)}`;
}
