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
    expect(buildScheduleWorkflowsVisibilityQuery(params.scheduleId)).toBe(
      `CadenceScheduleID = "${params.scheduleId}" ORDER BY CadenceScheduleTime DESC`
    );
  });

  it('requests an older page without search or archived listType', async () => {
    await fetchPage('page-2-token');

    const requestUrl = jest.mocked(request).mock.calls[0]?.[0] as string;
    const parsed = queryString.parseUrl(requestUrl);

    expect(parsed.query.listType).toBe('default');
    expect(parsed.query.inputType).toBe('query');
    expect(parsed.query.search).toBeUndefined();
    expect(parsed.query.listType).not.toBe('archived');
    expect(parsed.query.nextPage).toBe('page-2-token');
  });

  it('returns the next page token from the last response', () => {
    const { getNextPageParam } =
      getListWorkflowsForScheduleQueryOptions(params);

    if (!getNextPageParam) {
      throw new Error('Expected getNextPageParam to be defined');
    }

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
  const { queryFn } = options;

  if (typeof queryFn !== 'function') {
    throw new Error('Expected queryFn to be a function');
  }

  await queryFn({
    pageParam,
    queryKey: options.queryKey,
    signal: new AbortController().signal,
    meta: undefined,
    direction: 'forward',
  });
}
