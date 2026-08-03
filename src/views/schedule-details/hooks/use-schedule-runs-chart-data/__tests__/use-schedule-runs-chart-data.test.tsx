import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import {
  getMockPausedDescribeScheduleResponse,
  getMockRunningDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import useScheduleRunsChartData from '../use-schedule-runs-chart-data';

const MOCK_DOMAIN = 'test-domain';
const MOCK_CLUSTER = 'test-cluster';
const MOCK_SCHEDULE_ID = 'my-schedule';
const NOW_MS = Date.UTC(2024, 0, 1, 12, 0);
const HOUR_MS = 60 * 60_000;

describe(useScheduleRunsChartData.name, () => {
  it('starts loading before any response has resolved', () => {
    const { result } = setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse(),
      workflowsResponse: { workflows: [], nextPage: '' },
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('maps live workflow runs and the next execution once loaded', async () => {
    const { result } = setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse({
        info: {
          lastRunTime: null,
          nextRunTime: { seconds: String((NOW_MS + HOUR_MS) / 1000), nanos: 0 },
          totalRuns: '1',
          createTime: null,
          lastUpdateTime: null,
          missedRuns: '0',
          skippedRuns: '0',
          ongoingBackfills: [],
        },
      }),
      workflowsResponse: {
        workflows: [
          getMockWorkflowListItem({
            workflowID: 'wf-1',
            runID: 'run-1',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            startTime: NOW_MS - HOUR_MS,
            closeTime: NOW_MS - HOUR_MS + 1000,
            historyLength: 5,
            searchAttributes: {
              // Base64 of the JSON-encoded scheduled-time string, matching
              // how Cadence visibility search attributes are actually
              // encoded on the wire.
              CadenceScheduleTime: {
                data: Buffer.from(
                  JSON.stringify(new Date(NOW_MS - HOUR_MS).toISOString())
                ).toString('base64'),
              },
            },
          }),
        ],
        nextPage: '',
      },
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.runs).toEqual([
      expect.objectContaining({
        runId: 'run-1',
        scheduledTimeMs: NOW_MS - HOUR_MS,
      }),
    ]);
    expect(result.current.data.nextExecutionTimeMs).toBe(NOW_MS + HOUR_MS);
    // Skipped/missed execution inference is added in a follow-up slice.
    expect(result.current.data.skippedExecutions).toEqual([]);
  });

  it('returns null next execution for a paused schedule', async () => {
    const { result } = setup({
      describeScheduleResponse: getMockPausedDescribeScheduleResponse({
        info: {
          lastRunTime: null,
          nextRunTime: { seconds: String((NOW_MS + HOUR_MS) / 1000), nanos: 0 },
          totalRuns: '1',
          createTime: null,
          lastUpdateTime: null,
          missedRuns: '0',
          skippedRuns: '0',
          ongoingBackfills: [],
        },
      }),
      workflowsResponse: { workflows: [], nextPage: '' },
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.nextExecutionTimeMs).toBeNull();
  });

  it('drops runs at or after the next execution time', async () => {
    const nextExecutionTimeMs = NOW_MS + HOUR_MS;

    const { result } = setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse({
        info: {
          lastRunTime: null,
          nextRunTime: {
            seconds: String(nextExecutionTimeMs / 1000),
            nanos: 0,
          },
          totalRuns: '2',
          createTime: null,
          lastUpdateTime: null,
          missedRuns: '0',
          skippedRuns: '0',
          ongoingBackfills: [],
        },
      }),
      workflowsResponse: {
        workflows: [
          getMockWorkflowListItem({
            workflowID: 'wf-before',
            runID: 'run-before',
            startTime: NOW_MS - HOUR_MS,
            searchAttributes: {
              CadenceScheduleTime: {
                data: Buffer.from(
                  JSON.stringify(new Date(NOW_MS - HOUR_MS).toISOString())
                ).toString('base64'),
              },
            },
          }),
          getMockWorkflowListItem({
            workflowID: 'wf-at-next',
            runID: 'run-at-next',
            startTime: nextExecutionTimeMs,
            searchAttributes: {
              CadenceScheduleTime: {
                data: Buffer.from(
                  JSON.stringify(new Date(nextExecutionTimeMs).toISOString())
                ).toString('base64'),
              },
            },
          }),
        ],
        nextPage: '',
      },
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.runs).toEqual([
      expect.objectContaining({ runId: 'run-before' }),
    ]);
  });
});

function setup({
  describeScheduleResponse,
  workflowsResponse,
}: {
  describeScheduleResponse: ReturnType<
    typeof getMockRunningDescribeScheduleResponse
  >;
  workflowsResponse: { workflows: unknown[]; nextPage: string };
}) {
  return renderHook(
    () =>
      useScheduleRunsChartData({
        domain: MOCK_DOMAIN,
        cluster: MOCK_CLUSTER,
        scheduleId: MOCK_SCHEDULE_ID,
      }),
    {
      endpointsMocks: [
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/schedules/${MOCK_SCHEDULE_ID}`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () => HttpResponse.json(describeScheduleResponse),
        },
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () => HttpResponse.json(workflowsResponse),
        },
      ],
    }
  );
}
