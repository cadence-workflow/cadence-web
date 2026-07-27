import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';
import queryString from 'query-string';

import { renderHook, waitFor } from '@/test-utils/rtl';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';

import buildScheduleWorkflowsVisibilityQuery from '../build-schedule-workflows-visibility-query';
import useListWorkflowsForSchedule from '../use-list-workflows-for-schedule';
import {
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN,
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER,
} from '../use-list-workflows-for-schedule.constants';

const MOCK_DOMAIN = 'test-domain';
const MOCK_CLUSTER = 'test-cluster';
const MOCK_SCHEDULE_ID = 'my-schedule-id';
const MOCK_PAGE_SIZE = 2;

describe(useListWorkflowsForSchedule.name, () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('fetches the first page with schedule query params', async () => {
    const { result, getLatestRequestUrl } = setup({ pages: getMockPages() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const requestUrl = getLatestRequestUrl();
    const parsed = queryString.parseUrl(requestUrl);

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

  it('loads additional pages in CadenceScheduleTime order via fetchNextPage', async () => {
    const pages = getMockPages();
    const { result } = setup({ pages });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasNextPage).toBe(true);

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    expect(result.current.data?.pages).toHaveLength(2);

    const startTimes = result.current.data?.pages
      .flatMap((page) => page.workflows ?? [])
      .map((workflow) => workflow.startTime);

    expect(startTimes).toEqual([3000, 2000, 1000]);
  });

  it('polls only the latest page and preserves loaded history', async () => {
    jest.useFakeTimers();
    const pages = getMockPages();
    const refreshedLatestPage = {
      ...pages[0],
      workflows: [
        getMockWorkflowListItem({ workflowID: 'wf-new', startTime: 4000 }),
        ...(pages[0].workflows ?? []),
      ],
    };
    const { result, getLatestRequestCount, getHistoricalRequestCount } = setup({
      pages,
      latestPages: [pages[0], refreshedLatestPage],
      refetchIntervalMs: 1_000,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.fetchNextPage();
    });

    expect(getLatestRequestCount()).toBe(1);
    expect(getHistoricalRequestCount()).toBe(1);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1_000);
    });

    await waitFor(() => {
      expect(result.current.data?.pages[0]).toEqual(refreshedLatestPage);
    });

    expect(getLatestRequestCount()).toBe(2);
    expect(getHistoricalRequestCount()).toBe(1);
    expect(result.current.data?.pages).toHaveLength(2);
  });

  it('fetches refreshed pages until they overlap the loaded history', async () => {
    jest.useFakeTimers();
    const pages = getMockPages();
    const refreshedLatestPage = {
      workflows: [
        getMockWorkflowListItem({
          workflowID: 'wf-new-1',
          runID: 'run-new-1',
          startTime: 5000,
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-new-2',
          runID: 'run-new-2',
          startTime: 4000,
        }),
      ],
      nextPage: 'refreshed-page-2',
    };
    const { result, getLatestRequestCount, getHistoricalRequestCount } = setup({
      pages,
      latestPages: [pages[0], refreshedLatestPage],
      historicalPages: [
        pages[1],
        {
          workflows: [
            getMockWorkflowListItem({
              workflowID: 'wf-new-3',
              runID: 'run-new-3',
              startTime: 3500,
            }),
            pages[0].workflows[0],
          ],
          nextPage: 'refreshed-page-3',
        },
        {
          workflows: [pages[0].workflows[1], pages[1].workflows[0]],
          nextPage: '',
        },
      ],
      refetchIntervalMs: 1_000,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1_000);
    });

    await waitFor(() => {
      expect(getLatestRequestCount()).toBe(2);
    });

    await waitFor(() => {
      expect(getHistoricalRequestCount()).toBe(3);
    });

    await waitFor(() => {
      expect(
        new Set(
          result.current.data?.pages
            .flatMap((page) => page.workflows)
            .map((workflow) => workflow.workflowID)
        )
      ).toEqual(
        new Set(['wf-new-1', 'wf-new-2', 'wf-new-3', 'wf-1', 'wf-2', 'wf-3'])
      );
    });
  });
});

function getMockPages(): Array<ListWorkflowsResponse> {
  return [
    {
      workflows: [
        getMockWorkflowListItem({
          workflowID: 'wf-1',
          runID: 'run-1',
          startTime: 3000,
        }),
        getMockWorkflowListItem({
          workflowID: 'wf-2',
          runID: 'run-2',
          startTime: 2000,
        }),
      ],
      nextPage: 'page-2',
    },
    {
      workflows: [
        getMockWorkflowListItem({
          workflowID: 'wf-3',
          runID: 'run-3',
          startTime: 1000,
        }),
      ],
      nextPage: '',
    },
  ];
}

function setup({
  pages,
  latestPages = [pages[0]],
  historicalPages = pages.slice(1),
  refetchIntervalMs,
}: {
  pages: Array<ListWorkflowsResponse>;
  latestPages?: Array<ListWorkflowsResponse>;
  historicalPages?: Array<ListWorkflowsResponse>;
  refetchIntervalMs?: number;
}) {
  let latestRequestCount = 0;
  let historicalRequestCount = 0;
  let latestRequestUrl = '';

  const utils = renderHook(
    () =>
      useListWorkflowsForSchedule({
        domain: MOCK_DOMAIN,
        cluster: MOCK_CLUSTER,
        scheduleId: MOCK_SCHEDULE_ID,
        pageSize: MOCK_PAGE_SIZE,
        refetchIntervalMs,
      }),
    {
      endpointsMocks: [
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            latestRequestUrl = request.url;
            const { query } = queryString.parseUrl(request.url);
            const page = query.nextPage
              ? historicalPages[historicalRequestCount++] ??
                historicalPages[historicalPages.length - 1]
              : latestPages[latestRequestCount++] ??
                latestPages[latestPages.length - 1];
            return HttpResponse.json(page);
          },
        },
      ],
    }
  );

  return {
    ...utils,
    getLatestRequestUrl: () => latestRequestUrl,
    getLatestRequestCount: () => latestRequestCount,
    getHistoricalRequestCount: () => historicalRequestCount,
  };
}
