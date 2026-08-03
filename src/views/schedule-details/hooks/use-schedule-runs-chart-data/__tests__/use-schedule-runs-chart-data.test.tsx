import { HttpResponse } from 'msw';

import { renderHook, waitFor } from '@/test-utils/rtl';

import {
  getMockPausedDescribeScheduleResponse,
  getMockRunningDescribeScheduleResponse,
} from '@/route-handlers/describe-schedule/__fixtures__/mock-describe-schedule-response';
import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import useScheduleRunsChartData from '../use-schedule-runs-chart-data';

const mockDomain = 'test-domain';
const mockCluster = 'test-cluster';
const mockScheduleId = 'my-schedule';
const nowMs = Date.UTC(2024, 0, 1, 12, 0);
const hourMs = 60 * 60_000;

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
      describeScheduleResponse: getMockRunningDescribeScheduleResponse({
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
          createTime: {
            seconds: String((nowMs - 3 * hourMs) / 1000),
            nanos: 0,
          },
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
            startTime: nowMs - hourMs,
            closeTime: nowMs - hourMs + 1000,
            historyLength: 5,
            searchAttributes: {
              // Base64 of the JSON-encoded scheduled-time string, matching
              // how Cadence visibility search attributes are actually
              // encoded on the wire.
              CadenceScheduleTime: {
                data: Buffer.from(
                  JSON.stringify(new Date(nowMs - hourMs).toISOString())
                ).toString('base64'),
              },
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
    // Every hourly slot from the schedule's create time through now has no
    // matching run except the one hour ago, so those are inferred as skipped.
    expect(result.current.data.skippedExecutions).toEqual([
      { scheduledTimeMs: nowMs - 3 * hourMs },
      { scheduledTimeMs: nowMs - 2 * hourMs },
      { scheduledTimeMs: nowMs },
    ]);
  });

  it('renders nothing before the oldest loaded run while older pages remain unfetched', async () => {
    const { result } = setup({
      describeScheduleResponse: getMockRunningDescribeScheduleResponse({
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
          createTime: {
            seconds: String((nowMs - 3 * hourMs) / 1000),
            nanos: 0,
          },
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
            startTime: nowMs - hourMs,
            closeTime: nowMs - hourMs + 1000,
            historyLength: 5,
            searchAttributes: {
              CadenceScheduleTime: {
                data: Buffer.from(
                  JSON.stringify(new Date(nowMs - hourMs).toISOString())
                ).toString('base64'),
              },
            },
          }),
        ],
        // A non-empty cursor signals there are older pages not yet fetched.
        nextPage: 'more-runs',
      },
      domainResponse: getMockDomainResponse(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // The oldest loaded run is one hour ago, so the schedule's create time
    // (three hours ago) can't be diffed against real data - and there's no
    // background pagination to ever resolve that, so nothing is rendered
    // for it rather than a misleading "pending" marker.
    expect(result.current.data.pendingExecutions).toEqual([]);
    expect(result.current.data.skippedExecutions).toEqual([
      { scheduledTimeMs: nowMs },
    ]);
  });

  it('marks slots due since the last fetch as pending', async () => {
    const halfHourMs = 30 * 60_000;
    // The runs page was last (successfully) fetched half an hour before the
    // chart's "now", so slots since then can't be confirmed skipped yet -
    // only the earlier ones can.
    jest.useFakeTimers({
      now: nowMs - halfHourMs,
      doNotFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'queueMicrotask',
        'nextTick',
      ],
    });

    try {
      const { result } = setup({
        describeScheduleResponse: getMockRunningDescribeScheduleResponse({
          spec: {
            cronExpression: '0 * * * *',
            startTime: null,
            endTime: null,
            jitter: null,
          },
          info: {
            lastRunTime: null,
            nextRunTime: {
              seconds: String((nowMs + hourMs) / 1000),
              nanos: 0,
            },
            totalRuns: '1',
            createTime: {
              seconds: String((nowMs - 2 * hourMs) / 1000),
              nanos: 0,
            },
            lastUpdateTime: null,
            missedRuns: '0',
            skippedRuns: '0',
            ongoingBackfills: [],
          },
        }),
        workflowsResponse: { workflows: [], nextPage: '' },
        domainResponse: getMockDomainResponse(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data.pendingExecutions).toEqual([
        { scheduledTimeMs: nowMs },
      ]);
      expect(result.current.data.skippedExecutions).toEqual([
        { scheduledTimeMs: nowMs - 2 * hourMs },
        { scheduledTimeMs: nowMs - hourMs },
      ]);
    } finally {
      jest.useRealTimers();
    }
  });

  it('returns null next execution for a paused schedule', async () => {
    const { result } = setup({
      describeScheduleResponse: getMockPausedDescribeScheduleResponse({
        info: {
          lastRunTime: null,
          nextRunTime: { seconds: String((nowMs + hourMs) / 1000), nanos: 0 },
          totalRuns: '1',
          createTime: null,
          lastUpdateTime: null,
          missedRuns: '0',
          skippedRuns: '0',
          ongoingBackfills: [],
        },
      }),
      workflowsResponse: { workflows: [], nextPage: '' },
      domainResponse: getMockDomainResponse(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.nextExecutionTimeMs).toBeNull();
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
              CadenceScheduleTime: {
                data: Buffer.from(
                  JSON.stringify(new Date(nowMs - hourMs).toISOString())
                ).toString('base64'),
              },
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
      describeScheduleResponse: getMockRunningDescribeScheduleResponse({
        spec: {
          cronExpression: '0 * * * *',
          startTime: null,
          endTime: null,
          jitter: null,
        },
        info: {
          lastRunTime: null,
          nextRunTime: {
            seconds: String(nextExecutionTimeMs / 1000),
            nanos: 0,
          },
          totalRuns: '2',
          createTime: {
            seconds: String((nowMs - 3 * hourMs) / 1000),
            nanos: 0,
          },
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
            startTime: nowMs - hourMs,
            searchAttributes: {
              CadenceScheduleTime: {
                data: Buffer.from(
                  JSON.stringify(new Date(nowMs - hourMs).toISOString())
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
      domainResponse: getMockDomainResponse(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.runs).toEqual([
      expect.objectContaining({ runId: 'run-before' }),
    ]);
    expect(result.current.data.nextExecutionTimeMs).toBe(nowMs + hourMs);
    // Every hourly slot from the schedule's create time through now has no
    // matching run except the one hour ago, so those are inferred as skipped.
    expect(result.current.data.skippedExecutions).toEqual([
      { scheduledTimeMs: nowMs - 3 * hourMs },
      { scheduledTimeMs: nowMs - 2 * hourMs },
      { scheduledTimeMs: nowMs },
    ]);
  });
});

function setup({
  describeScheduleResponse,
  workflowsResponse,
  domainResponse,
  hookNowMs = nowMs,
}: {
  describeScheduleResponse: ReturnType<
    typeof getMockRunningDescribeScheduleResponse
  >;
  workflowsResponse: { workflows: unknown[]; nextPage: string };
  domainResponse: ReturnType<typeof getMockDomainResponse>;
  hookNowMs?: number;
}) {
  return renderHook(
    () =>
      useScheduleRunsChartData({
        domain: mockDomain,
        cluster: mockCluster,
        scheduleId: mockScheduleId,
        nowMs: hookNowMs,
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
