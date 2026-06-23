import { type InfiniteData } from '@tanstack/react-query';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/shared/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule.constants';

import workflowsForScheduleToChartPoints, {
  flattenScheduleWorkflowPages,
  getOldestLoadedScheduleTimeMs,
} from '../helpers/workflows-for-schedule-to-chart-points';

describe(workflowsForScheduleToChartPoints.name, () => {
  it('flattens infinite query pages in server page order', () => {
    const data = getMockInfiniteData();

    expect(flattenScheduleWorkflowPages(data).map((w) => w.workflowID)).toEqual(
      ['wf-1', 'wf-2', 'wf-3']
    );
  });

  it('maps CadenceScheduleTime search attributes to successful run markers with run details', () => {
    const chartPoints = workflowsForScheduleToChartPoints(
      getMockInfiniteData()
    );

    expect(chartPoints.successfulRuns).toEqual([
      {
        scheduledTimeMs: 3000,
        runs: [
          expect.objectContaining({
            runId: 'run-1',
            scheduledTimeMs: 3000,
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
          }),
        ],
      },
      {
        scheduledTimeMs: 2000,
        runs: [
          expect.objectContaining({
            runId: 'run-2',
            scheduledTimeMs: 2000,
          }),
        ],
      },
      {
        scheduledTimeMs: 1000,
        runs: [
          expect.objectContaining({
            runId: 'run-3',
            scheduledTimeMs: 1000,
          }),
        ],
      },
    ]);
    expect(chartPoints.missedExecutions).toEqual([]);
  });

  it('stacks multiple runs that share the same scheduled time', () => {
    const chartPoints = workflowsForScheduleToChartPoints({
      pages: [
        {
          workflows: [
            getMockWorkflowListItem({
              workflowID: 'wf-a',
              runID: 'run-a',
              status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
              historyLength: 5,
              startTime: 4000,
              closeTime: 4500,
              searchAttributes: {
                [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
                  data: '4000',
                },
              },
            }),
            getMockWorkflowListItem({
              workflowID: 'wf-b',
              runID: 'run-b',
              status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
              historyLength: 5,
              startTime: 4000,
              closeTime: 4600,
              searchAttributes: {
                [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
                  data: '4000',
                },
                CadenceScheduleBackfillID: {
                  data: 'YmFja2ZpbGwtc3RhY2stMTIz',
                },
              },
            }),
          ],
          nextPage: '',
        },
      ],
      pageParams: [undefined],
    });

    expect(chartPoints.successfulRuns).toEqual([
      {
        scheduledTimeMs: 4000,
        runs: [
          expect.objectContaining({ runId: 'run-a' }),
          expect.objectContaining({
            runId: 'run-b',
            backfillId: 'backfill-stack-123',
          }),
        ],
      },
    ]);
  });

  it('maps missed schedule workflows to missed execution markers', () => {
    const chartPoints = workflowsForScheduleToChartPoints({
      pages: [
        {
          workflows: [
            getMockWorkflowListItem({
              workflowID: 'missed-wf',
              runID: 'missed-run',
              startTime: 5000,
              historyLength: 0,
              closeTime: undefined,
              status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
              searchAttributes: {
                [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
                  data: '5000',
                },
              },
            }),
          ],
          nextPage: '',
        },
      ],
      pageParams: [undefined],
    });

    expect(chartPoints.missedExecutions).toEqual([
      {
        scheduledTimeMs: 5000,
        runs: [
          expect.objectContaining({
            runId: 'missed-run',
            startedTimeMs: 5000,
            endedTimeMs: null,
          }),
        ],
      },
    ]);
    expect(chartPoints.successfulRuns).toEqual([]);
  });

  it('returns the oldest loaded schedule time across pages', () => {
    expect(getOldestLoadedScheduleTimeMs(getMockInfiniteData())).toBe(1000);
  });
});

function getMockInfiniteData(): InfiniteData<ListWorkflowsResponse> {
  return {
    pages: [
      {
        workflows: [
          getMockWorkflowListItem({
            workflowID: 'wf-1',
            runID: 'run-1',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            historyLength: 5,
            startTime: 3000,
            searchAttributes: {
              [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
                data: '3000',
              },
            },
          }),
          getMockWorkflowListItem({
            workflowID: 'wf-2',
            runID: 'run-2',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            historyLength: 5,
            startTime: 2000,
            searchAttributes: {
              [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
                data: '2000',
              },
            },
          }),
        ],
        nextPage: 'page-2',
      },
      {
        workflows: [
          getMockWorkflowListItem({
            workflowID: 'wf-3',
            runID: 'run-3',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            historyLength: 5,
            startTime: 1000,
            searchAttributes: {
              [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
                data: '1000',
              },
            },
          }),
        ],
        nextPage: '',
      },
    ],
    pageParams: [undefined, 'page-2'],
  };
}
