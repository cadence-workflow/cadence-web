import { type WorkflowListItem } from '@/route-handlers/list-workflows/list-workflows.types';
import getSearchAttributeValue from '@/views/shared/workflows-list/helpers/get-search-attribute-value';

import { type ScheduleMetricsChartRun } from '../schedule-detail-metrics-chart-series.types';

import getScheduleWorkflowScheduledTimeMs from './get-schedule-workflow-scheduled-time-ms';

const SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE = 'CadenceScheduleBackfillID';

export default function workflowListItemToChartRun(
  workflow: WorkflowListItem
): ScheduleMetricsChartRun | null {
  const scheduledTimeMs = getScheduleWorkflowScheduledTimeMs(workflow);

  if (scheduledTimeMs == null) {
    return null;
  }

  const backfillId = getSearchAttributeValue(
    workflow,
    SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE
  );
  const normalizedBackfillId =
    typeof backfillId === 'string' && backfillId.length > 0
      ? backfillId
      : undefined;

  return {
    runId: workflow.runID,
    status: workflow.status,
    scheduledTimeMs,
    startedTimeMs: Number.isFinite(workflow.startTime)
      ? workflow.startTime
      : null,
    endedTimeMs:
      workflow.closeTime != null && Number.isFinite(workflow.closeTime)
        ? workflow.closeTime
        : null,
    backfillId: normalizedBackfillId,
  };
}
