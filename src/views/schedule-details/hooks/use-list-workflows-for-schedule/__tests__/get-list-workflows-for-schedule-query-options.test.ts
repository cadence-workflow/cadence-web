import queryString from 'query-string';

import request from '@/utils/request';

import buildScheduleWorkflowsVisibilityQuery from '../build-schedule-workflows-visibility-query';
import getListWorkflowsForScheduleQueryOptions from '../get-list-workflows-for-schedule-query-options';

jest.mock('@/utils/request', () => jest.fn());

const params = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  scheduleId: 'my-schedule-id',
  pageSize: 20,
};

describe(getListWorkflowsForScheduleQueryOptions.name, () => {
  beforeEach(() => {
    jest.mocked(request).mockResolvedValue({
      json: async () => ({ workflows: [], nextPage: '' }),
    } as Response);
  });

  it('returns a namespaced query key that does not vary by page', () => {
    const options = getListWorkflowsForScheduleQueryOptions(params);

    expect(options.queryKey).toEqual(['listWorkflowsForSchedule', params]);
    expect(options.initialPageParam).toBeUndefined();
  });

  it('requests the first page in descending schedule-time order', async () => {
    await fetchPage(undefined);

    const expectedUrl = queryString.stringifyUrl({
      url: `/api/domains/${params.domain}/${params.cluster}/workflows`,
      query: {
        listType: 'default',
        inputType: 'query',
        query: buildScheduleWorkflowsVisibilityQuery(params.scheduleId),
        pageSize: params.pageSize.toString(),
      },
    });

    expect(request).toHaveBeenCalledWith(expectedUrl);
  });

  it('requests an older page with nextPage token', async () => {
    await fetchPage('page-2-token');

    const expectedUrl = queryString.stringifyUrl({
      url: `/api/domains/${params.domain}/${params.cluster}/workflows`,
      query: {
        listType: 'default',
        inputType: 'query',
        query: buildScheduleWorkflowsVisibilityQuery(params.scheduleId),
        pageSize: params.pageSize.toString(),
        nextPage: 'page-2-token',
      },
    });

    expect(request).toHaveBeenCalledWith(expectedUrl);
  });

  it('returns the next page token from the last response', () => {
    const { getNextPageParam } =
      getListWorkflowsForScheduleQueryOptions(params);

    expect(
      getNextPageParam(
        { workflows: [], nextPage: 'next-token' },
        [],
        undefined,
        []
      )
    ).toBe('next-token');
    expect(
      getNextPageParam({ workflows: [], nextPage: '' }, [], undefined, [])
    ).toBeUndefined();
  });

  it('uses the requested refresh interval', () => {
    expect(
      getListWorkflowsForScheduleQueryOptions(params).refetchInterval
    ).toBeUndefined();
    expect(
      getListWorkflowsForScheduleQueryOptions({
        ...params,
        refetchIntervalMs: 10_000,
      }).refetchInterval
    ).toBe(10_000);
  });
});

async function fetchPage(pageParam: string | undefined) {
  const options = getListWorkflowsForScheduleQueryOptions(params);
  // `queryFn` is also typed to accept React Query's `skipToken` symbol, which
  // this factory never returns.
  const queryFn = options.queryFn as Exclude<
    typeof options.queryFn,
    symbol | undefined
  >;

  await queryFn({
    pageParam,
    queryKey: options.queryKey,
    signal: new AbortController().signal,
    meta: undefined,
    direction: 'forward',
  });
}
