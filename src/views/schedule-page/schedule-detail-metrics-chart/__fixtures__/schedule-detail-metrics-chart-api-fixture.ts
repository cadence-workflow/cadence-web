import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/shared/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule.constants';

export const SCHEDULE_METRICS_CHART_API_FIXTURE_NOW_MS = 6 * 60 * 60 * 1000;

const HOUR_MS = 60 * 60 * 1000;
const STACKED_SCHEDULE_TIME_MS = 4.5 * HOUR_MS;

export const MOCK_DOMAIN = 'test-domain';
export const MOCK_CLUSTER = 'test-cluster';
export const MOCK_SCHEDULE_ID = 'my-schedule';

export function getMockDescribeScheduleResponseForChart() {
  return getMockRunningDescribeScheduleResponse({
    info: {
      lastRunTime: { seconds: '21600', nanos: 0 },
      nextRunTime: { seconds: '25200', nanos: 0 },
      totalRuns: '3',
      createTime: null,
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
