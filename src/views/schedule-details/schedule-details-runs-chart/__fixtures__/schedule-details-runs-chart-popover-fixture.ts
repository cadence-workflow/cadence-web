import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/schedule-details/schedule-details.constants';

export const SCHEDULE_RUNS_CHART_POPOVER_FIXTURE_NOW_MS = Date.UTC(
  2024,
  0,
  1,
  12,
  0
);

const hourMs = 60 * 60_000;
const stackedScheduleTimeMs = Date.UTC(2024, 0, 1, 10, 30);

export const MOCK_DOMAIN = 'test-domain';
export const MOCK_CLUSTER = 'test-cluster';
export const MOCK_SCHEDULE_ID = 'my-schedule';

export function getMockDescribeScheduleResponseForRunsChartPopover() {
  return getMockRunningDescribeScheduleResponse({
    info: {
      lastRunTime: {
        seconds: String(
          SCHEDULE_RUNS_CHART_POPOVER_FIXTURE_NOW_MS / 1000 - 3600
        ),
        nanos: 0,
      },
      nextRunTime: {
        seconds: String(
          SCHEDULE_RUNS_CHART_POPOVER_FIXTURE_NOW_MS / 1000 + 3600
        ),
        nanos: 0,
      },
      totalRuns: '3',
      createTime: null,
      lastUpdateTime: null,
      missedRuns: '0',
      skippedRuns: '0',
      ongoingBackfills: [],
    },
  });
}

function scheduleTimeAttribute(scheduledTimeMs: number) {
  return {
    data: Buffer.from(
      JSON.stringify(new Date(scheduledTimeMs).toISOString())
    ).toString('base64'),
  };
}

export function getMockWorkflowPagesForRunsChartPopover(): Array<ListWorkflowsResponse> {
  const recentScheduledTimeMs =
    SCHEDULE_RUNS_CHART_POPOVER_FIXTURE_NOW_MS - hourMs;

  return [
    {
      workflows: [
        getMockWorkflowListItem({
          workflowID: 'wf-recent',
          runID: 'run-recent',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          historyLength: 10,
          closeTime: recentScheduledTimeMs + 1000,
          startTime: recentScheduledTimeMs,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: scheduleTimeAttribute(
              recentScheduledTimeMs
            ),
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-stack-a',
          runID: 'run-stack-a',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          historyLength: 10,
          closeTime: stackedScheduleTimeMs + 1000,
          startTime: stackedScheduleTimeMs,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: scheduleTimeAttribute(
              stackedScheduleTimeMs
            ),
            CadenceScheduleBackfillID: {
              data: Buffer.from('backfill-abc-123').toString('base64'),
            },
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-stack-b',
          runID: 'run-stack-b',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
          historyLength: 10,
          closeTime: stackedScheduleTimeMs + 2000,
          startTime: stackedScheduleTimeMs,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: scheduleTimeAttribute(
              stackedScheduleTimeMs
            ),
          },
        }),
      ],
      nextPage: '',
    },
  ];
}
