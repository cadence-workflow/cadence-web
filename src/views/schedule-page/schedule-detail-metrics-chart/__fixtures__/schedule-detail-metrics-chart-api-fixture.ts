import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule.constants';

export const SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS = 6 * 60 * 60 * 1000;

const HOUR_MS = 60 * 60 * 1000;
const STACKED_SCHEDULE_TIME_MS = 4.5 * HOUR_MS;

export const MOCK_DOMAIN = 'test-domain';
export const MOCK_CLUSTER = 'test-cluster';
export const MOCK_SCHEDULE_ID = 'my-schedule';

export function getMockDescribeScheduleResponseForChart() {
  return getMockRunningDescribeScheduleResponse({
    spec: {
      cronExpression: '*/15 * * * *',
      startTime: null,
      endTime: null,
      jitter: null,
    },
    info: {
      lastRunTime: { seconds: '21600', nanos: 0 },
      nextRunTime: { seconds: '22500', nanos: 0 },
      totalRuns: '3',
      createTime: { seconds: '0', nanos: 0 },
      lastUpdateTime: null,
      missedRuns: '0',
      skippedRuns: '0',
      ongoingBackfills: [],
    },
  });
}

export function getMockWorkflowPagesForChart(): Array<ListWorkflowsResponse> {
  return [
    {
      workflows: [
        getMockWorkflowListItem({
          workflowID: 'wf-recent',
          runID: 'run-recent',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          historyLength: 10,
          closeTime: 5 * HOUR_MS + 1000,
          startTime: 5 * HOUR_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(5 * HOUR_MS),
            },
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-stack-a',
          runID: 'run-stack-a',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          historyLength: 10,
          closeTime: STACKED_SCHEDULE_TIME_MS + 1000,
          startTime: STACKED_SCHEDULE_TIME_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(STACKED_SCHEDULE_TIME_MS),
            },
            CadenceScheduleBackfillID: {
              data: 'YmFja2ZpbGwtYWJjLTEyMw==',
            },
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-stack-b',
          runID: 'run-stack-b',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
          historyLength: 10,
          closeTime: STACKED_SCHEDULE_TIME_MS + 2000,
          startTime: STACKED_SCHEDULE_TIME_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(STACKED_SCHEDULE_TIME_MS),
            },
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-missed',
          runID: 'run-missed',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
          historyLength: 0,
          closeTime: undefined,
          startTime: 2 * HOUR_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(2 * HOUR_MS),
            },
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-timed-out',
          runID: 'run-timed-out',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_TIMED_OUT',
          historyLength: 10,
          closeTime: 4 * HOUR_MS + 1000,
          startTime: 4 * HOUR_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(4 * HOUR_MS),
            },
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-canceled',
          runID: 'run-canceled',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_CANCELED',
          historyLength: 10,
          closeTime: 3.5 * HOUR_MS + 1000,
          startTime: 3.5 * HOUR_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(3.5 * HOUR_MS),
            },
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-running',
          runID: 'run-running',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
          historyLength: 10,
          closeTime: undefined,
          startTime: 3 * HOUR_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(3 * HOUR_MS),
            },
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-backfill',
          runID: 'run-backfill',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          historyLength: 10,
          closeTime: 2.5 * HOUR_MS + 1000,
          startTime: 2.5 * HOUR_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(2.5 * HOUR_MS),
            },
            CadenceScheduleBackfillID: {
              data: 'YmFja2ZpbGwtc2luZ2xl',
            },
          },
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-failed',
          runID: 'run-failed',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
          historyLength: 10,
          closeTime: 1.5 * HOUR_MS + 1000,
          startTime: 1.5 * HOUR_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(1.5 * HOUR_MS),
            },
          },
        }),
      ],
      nextPage: 'page-2',
    },
    {
      workflows: [
        getMockWorkflowListItem({
          workflowID: 'wf-older',
          runID: 'run-older',
          status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          historyLength: 10,
          closeTime: 3 * HOUR_MS + 1000,
          startTime: 3 * HOUR_MS,
          searchAttributes: {
            [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
              data: String(3 * HOUR_MS),
            },
          },
        }),
      ],
      nextPage: '',
    },
  ];
}
