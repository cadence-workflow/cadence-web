import { type WorkflowListItem } from '@/route-handlers/list-workflows/list-workflows.types';
import { type ChartSeriesRun } from '@/views/schedule-details/schedule-details-runs-chart-series/schedule-details-runs-chart-series.types';
import getSearchAttributeValue from '@/views/shared/workflows-list/helpers/get-search-attribute-value';

import getScheduleWorkflowScheduledTimeMs from './get-schedule-workflow-scheduled-time-ms';

const SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE = 'CadenceScheduleBackfillID';

export default function workflowListItemToChartSeriesRun(
  workflow: WorkflowListItem
): ChartSeriesRun | null {
  const scheduledTimeMs = getScheduleWorkflowScheduledTimeMs(workflow);

  if (scheduledTimeMs == null) {
    return null;
  }

  const backfillId = getSearchAttributeValue(
    workflow,
    SCHEDULE_BACKFILL_SEARCH_ATTRIBUTE
  );

  return {
    runId: workflow.runID,
    status: workflow.status,
    scheduledTimeMs,
    isBackfill: typeof backfillId === 'string' && backfillId.length > 0,
  };
}
