import { type BuildScheduleDetailsPageClusterPathParams } from '../schedule-details-page-header-cluster-selector.types';

export default function buildScheduleDetailsPageClusterPath({
  domain,
  cluster,
  scheduleId,
  scheduleTab,
}: BuildScheduleDetailsPageClusterPathParams): string {
  const tabSegment = scheduleTab ? `/${encodeURIComponent(scheduleTab)}` : '';
  return `/domains/${encodeURIComponent(domain)}/${encodeURIComponent(cluster)}/schedules/${encodeURIComponent(scheduleId)}${tabSegment}`;
}
