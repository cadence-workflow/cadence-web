import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { getMockRunningDescribeScheduleResponse } from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import useScheduleRunsChartData from '../use-schedule-runs-chart-data';

const mockDomain = 'test-domain';
const mockCluster = 'test-cluster';
const mockScheduleId = 'my-schedule';
const nowMs = Date.UTC(2024, 0, 1, 12, 0);
const hourMs = 60 * 60_000;
// createTime is 3 hours before nowMs; every hourly slot since then has no
// matching run except the one an hour ago, so those are inferred as skipped.
const skippedExecutionsSinceCreateTime = [
  { scheduledTimeMs: nowMs - 3 * hourMs },
  { scheduledTimeMs: nowMs - 2 * hourMs },
  { scheduledTimeMs: nowMs },
];
const hourlyScheduleOverrides = {
  spec: {
    cronExpression: '0 * * * *',
    startTime: null,
    endTime: null,
    jitter: null,
  },
  info: {
    lastRunTime: null,
    nextRunTime: { seconds: String((nowMs + hourMs) / 1000), nanos: 0 },
    totalRuns: '2',
    createTime: { seconds: String((nowMs - 3 * hourMs) / 1000), nanos: 0 },
    lastUpdateTime: null,
    missedRuns: '0',
    skippedRuns: '0',
    ongoingBackfills: [],
  },
};

describe(useScheduleRunsChartData.name, () => {
  it('starts loading before any response has resolved', () => {
    const { result } = setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse(),
      workflowsResponse: { workflows: [], nextPage: '' },
      domainResponse: getMockDomainResponse(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('maps live workflow runs, skipped occurrences, and the next execution once loaded', async () => {
    const { result } = setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse(
        hourlyScheduleOverrides
      ),
      workflowsResponse: {
        workflows: [
          getMockWorkflowListItem({
            workflowID: 'wf-1',
            runID: 'run-1',
            status: 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED',
            startTime: nowMs - hourMs,
            closeTime: nowMs - hourMs + 1000,
            historyLength: 5,
            searchAttributes: {
              CadenceScheduleTime: scheduleTimeAttribute(nowMs - hourMs),
            },
          }),
        ],
        nextPage: '',
      },
      domainResponse: getMockDomainResponse(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.runs).toEqual([
      expect.objectContaining({
        runId: 'run-1',
        scheduledTimeMs: nowMs - hourMs,
      }),
    ]);
    expect(result.current.data.nextExecutionTimeMs).toBe(nowMs + hourMs);
    expect(result.current.data.skippedExecutions).toEqual(
      skippedExecutionsSinceCreateTime
    );
    expect(result.current.timelineStartMs).toBe(nowMs - 3 * hourMs);
    expect(result.current.oldestLoadedScheduleTimeMs).toBe(nowMs - hourMs);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('exposes pagination state and fetches the next page of runs on request', async () => {
    const { result } = setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse(),
      workflowsResponse: {
        workflows: [
          getMockWorkflowListItem({
            workflowID: 'wf-1',
            runID: 'run-1',
            startTime: nowMs - hourMs,
            searchAttributes: {
              CadenceScheduleTime: scheduleTimeAttribute(nowMs - hourMs),
            },
          }),
        ],
        nextPage: 'page-2',
      },
      domainResponse: getMockDomainResponse(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.isFetchingNextPage).toBe(false);
    expect(result.current.isFetchNextPageError).toBe(false);

    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.isFetchingNextPage).toBe(false));
  });

  it('keeps all runs when nextRunTime is invalid', async () => {
    const { result } = setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse({
        info: {
          lastRunTime: null,
          nextRunTime: { seconds: 'not-a-number', nanos: 0 },
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
            startTime: nowMs - hourMs,
            searchAttributes: {
              CadenceScheduleTime: scheduleTimeAttribute(nowMs - hourMs),
            },
          }),
        ],
        nextPage: '',
      },
      domainResponse: getMockDomainResponse(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.nextExecutionTimeMs).toBeNull();
    expect(result.current.data.runs).toEqual([
      expect.objectContaining({
        runId: 'run-1',
        scheduledTimeMs: nowMs - hourMs,
      }),
    ]);
  });

  it('drops runs at or after the next execution time', async () => {
    const nextExecutionTimeMs = nowMs + hourMs;

    const { result } = setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse(
        hourlyScheduleOverrides
      ),
      workflowsResponse: {
        workflows: [
          getMockWorkflowListItem({
            workflowID: 'wf-before',
            runID: 'run-before',
            startTime: nowMs - hourMs,
            searchAttributes: {
              CadenceScheduleTime: scheduleTimeAttribute(nowMs - hourMs),
            },
          }),
          getMockWorkflowListItem({
            workflowID: 'wf-at-next',
            runID: 'run-at-next',
            startTime: nextExecutionTimeMs,
            searchAttributes: {
              CadenceScheduleTime: scheduleTimeAttribute(nextExecutionTimeMs),
            },
          }),
        ],
        nextPage: '',
      },
      domainResponse: getMockDomainResponse(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.runs).toEqual([
      expect.objectContaining({ runId: 'run-before' }),
    ]);
    expect(result.current.data.nextExecutionTimeMs).toBe(nowMs + hourMs);
    expect(result.current.data.skippedExecutions).toEqual(
      skippedExecutionsSinceCreateTime
    );
  });
});

function scheduleTimeAttribute(scheduledTimeMs: number) {
  return {
    data: Buffer.from(
      JSON.stringify(new Date(scheduledTimeMs).toISOString())
    ).toString('base64'),
  };
}

function setup({
  describeScheduleResponse,
  workflowsResponse,
  domainResponse,
}: {
  describeScheduleResponse: ReturnType<
    typeof getMockRunningDescribeScheduleResponse
  >;
  workflowsResponse: { workflows: unknown[]; nextPage: string };
  domainResponse: ReturnType<typeof getMockDomainResponse>;
}) {
  return renderHook(
    () =>
      useScheduleRunsChartData({
        domain: mockDomain,
        cluster: mockCluster,
        scheduleId: mockScheduleId,
        nowMs,
      }),
    {
      endpointsMocks: [
        {
          path: `/api/domains/${mockDomain}/${mockCluster}/schedules/${mockScheduleId}`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () => HttpResponse.json(describeScheduleResponse),
        },
        {
          path: `/api/domains/${mockDomain}/${mockCluster}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () => HttpResponse.json(workflowsResponse),
        },
        {
          path: `/api/domains/${mockDomain}/${mockCluster}`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: () => HttpResponse.json(domainResponse),
        },
      ],
    }
  );
}

function getMockDomainResponse(overrides: Record<string, unknown> = {}) {
  return {
    workflowExecutionRetentionPeriod: { seconds: '604800', nanos: 0 },
    ...overrides,
  };
}
