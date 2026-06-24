import { act } from '@testing-library/react';
import { HttpResponse } from 'msw';
import queryString from 'query-string';

import { getMockWorkflowListItem } from '@/route-handlers/list-workflows/__fixtures__/mock-workflow-list-items';
import { type ListWorkflowsResponse } from '@/route-handlers/list-workflows/list-workflows.types';
import { renderHook, waitFor } from '@/test-utils/rtl';

import buildScheduleWorkflowsVisibilityQuery from '../build-schedule-workflows-visibility-query';
import {
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN,
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER,
} from '../use-list-workflows-for-schedule.constants';
import useListWorkflowsForSchedule from '../use-list-workflows-for-schedule';

const MOCK_DOMAIN = 'test-domain';
const MOCK_CLUSTER = 'test-cluster';
const MOCK_SCHEDULE_ID = 'my-schedule-id';
const MOCK_PAGE_SIZE = 2;

describe(useListWorkflowsForSchedule.name, () => {
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
    expect(parsed.query.sortColumn).toBe(
      SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN
    );
    expect(parsed.query.sortOrder).toBe(
      SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER
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
});

function getMockPages(): Array<ListWorkflowsResponse> {
  return [
    {
      workflows: [
        getMockWorkflowListItem({ workflowID: 'wf-1', startTime: 3000 }),
        getMockWorkflowListItem({ workflowID: 'wf-2', startTime: 2000 }),
      ],
      nextPage: 'page-2',
    },
    {
      workflows: [
        getMockWorkflowListItem({ workflowID: 'wf-3', startTime: 1000 }),
      ],
      nextPage: '',
    },
  ];
}

function setup({ pages }: { pages: Array<ListWorkflowsResponse> }) {
  let requestCount = 0;
  let latestRequestUrl = '';

  const utils = renderHook(
    () =>
      useListWorkflowsForSchedule({
        domain: MOCK_DOMAIN,
        cluster: MOCK_CLUSTER,
        scheduleId: MOCK_SCHEDULE_ID,
        pageSize: MOCK_PAGE_SIZE,
      }),
    {
      endpointsMocks: [
        {
          path: `/api/domains/${MOCK_DOMAIN}/${MOCK_CLUSTER}/workflows`,
          httpMethod: 'GET',
          mockOnce: false,
          httpResolver: async ({ request }) => {
            latestRequestUrl = request.url;
            const page = pages[requestCount] ?? pages[pages.length - 1];
            requestCount += 1;
            return HttpResponse.json(page);
          },
        },
      ],
    }
  );

  return {
    ...utils,
    getLatestRequestUrl: () => latestRequestUrl,
  };
}
