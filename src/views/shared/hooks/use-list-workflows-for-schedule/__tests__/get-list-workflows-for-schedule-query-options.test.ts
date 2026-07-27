import queryString from 'query-string';

import request from '@/utils/request';

import buildScheduleWorkflowsVisibilityQuery from '../build-schedule-workflows-visibility-query';
import {
  getHistoricalWorkflowsForScheduleQueryOptions,
  getLatestWorkflowsForScheduleQueryOptions,
} from '../get-list-workflows-for-schedule-query-options';

jest.mock('@/utils/request', () => jest.fn());

const params = {
  domain: 'test-domain',
  cluster: 'test-cluster',
  scheduleId: 'my-schedule-id',
  pageSize: 20,
};

describe(getLatestWorkflowsForScheduleQueryOptions.name, () => {
  beforeEach(() => {
    jest.mocked(request).mockResolvedValue({
      json: async () => ({ workflows: [], nextPage: '' }),
    } as Response);
  });

  it('returns distinct namespaced query keys for latest and historical data', () => {
    const latestOptions = getLatestWorkflowsForScheduleQueryOptions(params);
    const historicalOptions = getHistoricalWorkflowsForScheduleQueryOptions({
      initialPageParam: 'page-2-token',
      params,
    });

    expect(latestOptions.queryKey).toEqual([
      'listLatestWorkflowsForSchedule',
      params,
    ]);
    expect(historicalOptions.queryKey).toEqual([
      'listHistoricalWorkflowsForSchedule',
      params,
      'page-2-token',
    ]);
  });

  it('requests the latest active workflows in descending schedule-time order', async () => {
    const options = getLatestWorkflowsForScheduleQueryOptions(params);
    const { queryFn } = options;

    if (typeof queryFn !== 'function') {
      throw new Error('Expected queryFn to be a function');
    }

    await queryFn({
      queryKey: options.queryKey,
      signal: new AbortController().signal,
      meta: undefined,
    });

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

  it('requests a historical page without search or archived listType', async () => {
    const options = getHistoricalWorkflowsForScheduleQueryOptions({
      initialPageParam: 'page-2-token',
      params,
    });
    const { queryFn } = options;

    if (typeof queryFn !== 'function') {
      throw new Error('Expected queryFn to be a function');
    }

    await queryFn({
      pageParam: 'page-2-token',
      queryKey: options.queryKey,
      signal: new AbortController().signal,
      meta: undefined,
      direction: 'forward',
    });

    const requestUrl = jest.mocked(request).mock.calls[0]?.[0] as string;
    const parsed = queryString.parseUrl(requestUrl);

    expect(parsed.query.listType).toBe('default');
    expect(parsed.query.inputType).toBe('query');
    expect(parsed.query.search).toBeUndefined();
    expect(parsed.query.listType).not.toBe('archived');
    expect(parsed.query.nextPage).toBe('page-2-token');
  });

  it('returns the next page token from the last response', () => {
    const options = getHistoricalWorkflowsForScheduleQueryOptions({
      initialPageParam: 'page-2-token',
      params,
    });
    const getNextPageParam = options.getNextPageParam;

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

  it('uses the requested latest-page refresh interval', () => {
    const options = getLatestWorkflowsForScheduleQueryOptions({
      ...params,
      refetchIntervalMs: 10_000,
    });

    expect(options.refetchInterval).toBe(10_000);
  });
});
