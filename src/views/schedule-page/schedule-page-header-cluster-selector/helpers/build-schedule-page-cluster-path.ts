import { type BuildSchedulePageClusterPathParams } from '../schedule-page-header-cluster-selector.types';

export default function buildSchedulePageClusterPath({
  domain,
  cluster,
  scheduleId,
  scheduleTab,
}: BuildSchedulePageClusterPathParams): string {
  const tabSegment = scheduleTab ? `/${encodeURIComponent(scheduleTab)}` : '';
  return `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/schedules/${encodeURIComponent(scheduleId)}${tabSegment}`;
}
