import { type InfiniteData } from '@tanstack/react-query';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN } from '@/views/schedule-details/hooks/use-list-workflows-for-schedule/use-list-workflows-for-schedule.constants';

import workflowsForScheduleToChartSeriesRuns from '../workflows-for-schedule-to-chart-series-runs';

describe(workflowsForScheduleToChartSeriesRuns.name, () => {
  it('maps CadenceScheduleTime search attributes to run markers', () => {
    const runs = workflowsForScheduleToChartSeriesRuns(getMockInfiniteData());

    expect(runs).toEqual([
      expect.objectContaining({
        runId: 'run-1',
        scheduledTimeMs: 3000,
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      }),
      expect.objectContaining({ runId: 'run-2', scheduledTimeMs: 2000 }),
      expect.objectContaining({ runId: 'run-3', scheduledTimeMs: 1000 }),
    ]);
  });

  it('marks a run with a backfill search attribute as a backfill', () => {
    const runs = workflowsForScheduleToChartSeriesRuns({
      pages: [
        {
          workflows: [
            getMockWorkflowListItem({
              workflowID: 'wf-a',
              runID: 'run-a',
              status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_FAILED',
              startTime: 4000,
              searchAttributes: {
                [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]:
                  scheduleTimeAttribute(4000),
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

    expect(runs).toEqual([
      expect.objectContaining({ runId: 'run-a', isBackfill: true }),
    ]);
  });

  it('deduplicates a run repeated across workflow pages', () => {
    const duplicateRun = getMockWorkflowListItem({
      workflowID: 'duplicate-workflow',
      runID: 'duplicate-run',
      status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
      startTime: 4000,
      searchAttributes: {
        [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]:
          scheduleTimeAttribute(4000),
      },
    });
    const runs = workflowsForScheduleToChartSeriesRuns({
      pages: [
        { workflows: [duplicateRun], nextPage: 'page-2' },
        { workflows: [duplicateRun], nextPage: '' },
      ],
      pageParams: [undefined, 'page-2'],
    });

    expect(runs).toEqual([expect.objectContaining({ runId: 'duplicate-run' })]);
  });

  it('keeps zero-history open workflows as running executions', () => {
    const runs = workflowsForScheduleToChartSeriesRuns({
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
                [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]:
                  scheduleTimeAttribute(5000),
              },
            }),
          ],
          nextPage: '',
        },
      ],
      pageParams: [undefined],
    });

    expect(runs).toEqual([
      expect.objectContaining({
        runId: 'missed-run',
        status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
        scheduledTimeMs: 5000,
      }),
    ]);
  });

  it('returns an empty array when no pages have loaded', () => {
    expect(workflowsForScheduleToChartSeriesRuns(undefined)).toEqual([]);
  });

  it('falls back to startTime when the schedule search attribute is missing', () => {
    const runs = workflowsForScheduleToChartSeriesRuns({
      pages: [
        {
          workflows: [
            getMockWorkflowListItem({
              workflowID: 'wf-fallback',
              runID: 'run-fallback',
              startTime: 1500,
            }),
          ],
          nextPage: '',
        },
      ],
      pageParams: [undefined],
    });

    expect(runs).toEqual([
      expect.objectContaining({ runId: 'run-fallback', scheduledTimeMs: 1500 }),
    ]);
  });

  it('skips workflows with no parsable scheduled time', () => {
    const runs = workflowsForScheduleToChartSeriesRuns({
      pages: [
        {
          workflows: [
            getMockWorkflowListItem({
              workflowID: 'wf-unparsable',
              runID: 'run-unparsable',
              startTime: Number.NaN,
              searchAttributes: {
                [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]: {
                  data: Buffer.from(JSON.stringify('not-a-date')).toString(
                    'base64'
                  ),
                },
              },
            }),
          ],
          nextPage: '',
        },
      ],
      pageParams: [undefined],
    });

    expect(runs).toEqual([]);
  });
});

function scheduleTimeAttribute(scheduledTimeMs: number) {
  return {
    data: Buffer.from(
      JSON.stringify(new Date(scheduledTimeMs).toISOString())
    ).toString('base64'),
  };
}

function getMockInfiniteData(): InfiniteData<ListWorkflowsResponse> {
  return {
    pages: [
      {
        workflows: [
          getMockWorkflowListItem({
            workflowID: 'wf-1',
            runID: 'run-1',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            startTime: 3000,
            searchAttributes: {
              [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]:
                scheduleTimeAttribute(3000),
            },
          }),
          getMockWorkflowListItem({
            workflowID: 'wf-2',
            runID: 'run-2',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            startTime: 2000,
            searchAttributes: {
              [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]:
                scheduleTimeAttribute(2000),
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
            startTime: 1000,
            searchAttributes: {
              [SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN]:
                scheduleTimeAttribute(1000),
            },
          }),
        ],
        nextPage: '',
      },
    ],
    pageParams: [undefined, 'page-2'],
  };
}
