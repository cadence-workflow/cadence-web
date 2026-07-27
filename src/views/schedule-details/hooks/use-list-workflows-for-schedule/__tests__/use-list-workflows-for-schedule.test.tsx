import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';
import queryString from 'query-string';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';

import buildScheduleWorkflowsVisibilityQuery from '../build-schedule-workflows-visibility-query';
import useListWorkflowsForSchedule from '../use-list-workflows-for-schedule';
import {
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN,
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER,
} from '../use-list-workflows-for-schedule.constants';

const MOCK_DOMAIN = 'test-domain';
const MOCK_CLUSTER = 'test-cluster';
const MOCK_SCHEDULE_ID = 'my-schedule-id';
const MOCK_PAGE_SIZE = 5;
const MOCK_REFETCH_INTERVAL_MS = 10_000;
const MOCK_RUN_COUNT = 40;

describe(useListWorkflowsForSchedule.name, () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('fetches the first page with schedule query params', async () => {
    const { result, getLatestRequestUrl } = await setup();

    const parsed = queryString.parseUrl(getLatestRequestUrl());

    expect(parsed.query.listType).toBe('default');
    expect(parsed.query.inputType).toBe('query');
    expect(parsed.query.search).toBeUndefined();
    expect(parsed.query.listType).not.toBe('archived');
    expect(parsed.query.query).toBe(
      buildScheduleWorkflowsVisibilityQuery(MOCK_SCHEDULE_ID)
    );
    expect(parsed.query.query).toContain(
      `ORDER BY ${SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN} ${SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER}`
    );
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('loads older pages in CadenceScheduleTime order via fetchNextPage', async () => {
    const harness = await setup();

    await harness.loadOlderPages(2);

    expect(harness.result.current.data?.pages).toHaveLength(3);
    expect(getLoadedRunSeqs(harness)).toEqual(
      harness.server.runs.slice(0, MOCK_PAGE_SIZE * 3)
    );
  });

  it('keeps loaded runs contiguous while new runs push older ones down', async () => {
    const harness = await setup();
    await harness.loadOlderPages(3);

    for (let i = 0; i < 3; i++) {
      harness.server.addRuns(1);
      await harness.pollOnce();
      expectContiguous(harness);
    }

    expect(harness.renderedGaps).toEqual([]);
  });

  it('keeps loaded runs contiguous when more runs than a page arrive at once', async () => {
    const harness = await setup();
    await harness.loadOlderPages(3);

    harness.server.addRuns(MOCK_PAGE_SIZE + 2);
    await harness.pollOnce();

    expectContiguous(harness);
    expect(harness.renderedGaps).toEqual([]);
  });

  it('refreshes the status of an already loaded older run', async () => {
    const harness = await setup();
    await harness.loadOlderPages(2);

    const olderRunSeq = harness.server.runs[MOCK_PAGE_SIZE * 2];
    harness.server.closeRun(olderRunSeq);
    await harness.pollOnce();

    expect(getLoadedRun(harness, olderRunSeq)?.status).toBe(
      'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED'
    );
  });

  it('refreshes as soon as the runs revision changes', async () => {
    const harness = await setup({ initialRunsRevision: '40' });
    await harness.loadOlderPages(2);

    harness.server.addRuns(1);
    await harness.setRunsRevision('41');

    expectContiguous(harness);
    expect(harness.renderedGaps).toEqual([]);
  });

  it('does not refresh when the runs revision first arrives', async () => {
    const harness = await setup();
    await harness.loadOlderPages(2);
    const requestsAfterLoad = harness.server.requestCount();

    // The schedule description resolves after the runs are already loaded, so
    // the revision it brings describes what is on screen.
    await harness.setRunsRevision('40');

    expect(harness.server.requestCount()).toBe(requestsAfterLoad);
  });

  it('keeps reporting the end of the history across polls', async () => {
    const harness = await setup({ runCount: MOCK_PAGE_SIZE * 2 });

    await harness.loadOlderPages(1);
    expect(harness.result.current.hasNextPage).toBe(false);

    await harness.pollOnce();

    expectContiguous(harness);
    expect(harness.result.current.hasNextPage).toBe(false);

    // New runs push the oldest ones out of the loaded window, so there is
    // older history to load again.
    harness.server.addRuns(2);
    await harness.pollOnce();

    expectContiguous(harness);
    expect(harness.result.current.hasNextPage).toBe(true);
  });
});

type Harness = Awaited<ReturnType<typeof setup>>;

/**
 * The chart infers skipped runs from the gaps between loaded runs, so the
 * loaded runs must always be the newest N with nothing missing in between.
 */
function expectContiguous(harness: Harness) {
  const loaded = getLoadedRunSeqs(harness);

  expect(loaded).toEqual(harness.server.runs.slice(0, loaded.length));
}

function getLoadedRun({ result }: Harness, seq: number) {
  return (result.current.data?.pages ?? [])
    .flatMap((page) => page.workflows ?? [])
    .find((workflow) => workflow.runID === `run-${seq}`);
}

function getLoadedRunSeqs({ result }: Harness) {
  return getRunSeqs(result.current.data?.pages ?? []);
}

function getRunSeqs(pages: Array<{ workflows?: Array<{ runID: string }> }>) {
  return Array.from(
    new Set(
      pages
        .flatMap((page) => page.workflows ?? [])
        .map((workflow) => Number(workflow.runID.replace('run-', '')))
    )
  ).sort((a, b) => b - a);
}

function findGap(pages: Array<{ workflows?: Array<{ runID: string }> }>) {
  const seqs = getRunSeqs(pages);
  const gapIndex = seqs.findIndex(
    (seq, index) => index > 0 && seqs[index - 1] - seq !== 1
  );

  return gapIndex === -1
    ? null
    : `missing run-${seqs[gapIndex] + 1} between run-${seqs[gapIndex - 1]} and run-${seqs[gapIndex]}`;
}

async function setup({
  runCount = MOCK_RUN_COUNT,
  latencyMs = 100,
  initialRunsRevision,
}: {
  runCount?: number;
  latencyMs?: number;
  initialRunsRevision?: string;
} = {}) {
  jest.useFakeTimers();

  let nextRunSeq = runCount;
  let requestCount = 0;
  let latestRequestUrl = '';
  const runs = Array.from({ length: runCount }, (_, index) => runCount - index);
  const closedRunSeqs = new Set<number>();
  const renderedGaps: string[] = [];

  const server = {
    runs,
    addRuns: (count: number) => {
      for (let i = 0; i < count; i++) {
        nextRunSeq += 1;
        runs.unshift(nextRunSeq);
      }
    },
    closeRun: (seq: number) => closedRunSeqs.add(seq),
    requestCount: () => requestCount,
  };

  const utils = renderHook(
    (props?: { runsRevision?: string }) => {
      const result = useListWorkflowsForSchedule({
        domain: MOCK_DOMAIN,
        cluster: MOCK_CLUSTER,
        scheduleId: MOCK_SCHEDULE_ID,
        pageSize: MOCK_PAGE_SIZE,
        refetchIntervalMs: MOCK_REFETCH_INTERVAL_MS,
        runsRevision: props?.runsRevision,
      });
      const gap = findGap(result.data?.pages ?? []);

      if (gap) {
        renderedGaps.push(gap);
      }

      return result;
    },
    {
      endpointsMocks: [
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            requestCount += 1;
            latestRequestUrl = request.url;
            const { query } = queryString.parseUrl(request.url);
            const nextPage = query.nextPage as string | undefined;
            // Stands in for a `search_after` token: resume just after the run
            // the previous page ended on.
            const startIndex = nextPage
              ? runs.indexOf(Number(nextPage.replace('after-', ''))) + 1
              : 0;
            const page = runs.slice(startIndex, startIndex + MOCK_PAGE_SIZE);

            await new Promise((resolve) => setTimeout(resolve, latencyMs));

            return HttpResponse.json({
              workflows: page.map((seq) =>
                getMockWorkflowListItem({
                  workflowID: `wf-${seq}`,
                  runID: `run-${seq}`,
                  startTime: seq * 1000,
                  status: closedRunSeqs.has(seq)
                    ? 'WORKFLOW_EXECUTION_CLOSE_STATUS_COMPLETED'
                    : 'WORKFLOW_EXECUTION_CLOSE_STATUS_INVALID',
                })
              ),
              nextPage:
                startIndex + page.length < runs.length
                  ? `after-${page[page.length - 1]}`
                  : '',
            });
          },
        },
      ],
    },
    { initialProps: { runsRevision: initialRunsRevision } }
  );

  const advance = async (ms: number) =>
    act(async () => {
      await jest.advanceTimersByTimeAsync(ms);
    });

  // Settles the in-flight requests and everything they trigger, without ever
  // running long enough to start the next poll.
  const waitForIdle = async () => {
    for (let attempt = 0; attempt < 20; attempt++) {
      const requestsBefore = requestCount;
      await advance(latencyMs * 2);

      if (requestsBefore === requestCount && !utils.result.current.isFetching) {
        return;
      }
    }

    throw new Error('workflows never settled');
  };

  const harness = {
    ...utils,
    server,
    renderedGaps,
    getLatestRequestUrl: () => latestRequestUrl,
    pollOnce: async () => {
      await advance(MOCK_REFETCH_INTERVAL_MS);
      await waitForIdle();
    },
    setRunsRevision: async (runsRevision: string) => {
      utils.rerender({ runsRevision });
      await waitForIdle();
    },
    loadOlderPages: async (count: number) => {
      for (let i = 0; i < count; i++) {
        await act(async () => {
          void utils.result.current.fetchNextPage();
        });
        await waitForIdle();
      }
    },
  };

  await advance(latencyMs);
  await waitFor(() => {
    expect(utils.result.current.isLoading).toBe(false);
  });
  renderedGaps.length = 0;

  return harness;
}
