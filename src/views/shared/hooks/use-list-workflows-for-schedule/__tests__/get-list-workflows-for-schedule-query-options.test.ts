import queryString from 'query-string';

import request from '@/utils/request';

import buildScheduleWorkflowsVisibilityQuery from '../build-schedule-workflows-visibility-query';
import getListWorkflowsForScheduleQueryOptions from '../get-list-workflows-for-schedule-query-options';
import {
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN,
  SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER,
} from '../use-list-workflows-for-schedule.constants';

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

  it('returns namespaced queryKey including domain, cluster, scheduleId, and pageSize', () => {
    const options = getListWorkflowsForScheduleQueryOptions(params);

    expect(options.queryKey).toEqual(['listWorkflowsForSchedule', params]);
  });

  it('requests active advanced-visibility workflows with scheduleId-only query', async () => {
    const options = getListWorkflowsForScheduleQueryOptions(params);
    const { queryFn } = options;

    if (typeof queryFn !== 'function') {
      throw new Error('Expected queryFn to be a function');
    }

    await queryFn({
      pageParam: undefined,
      queryKey: options.queryKey,
      signal: new AbortController().signal,
      meta: undefined,
      direction: 'forward',
    });

    const expectedUrl = queryString.stringifyUrl({
      url: `/api/domains/${params.domain}/${params.cluster}/workflows`,
      query: {
        listType: 'default',
        inputType: 'query',
        query: buildScheduleWorkflowsVisibilityQuery(params.scheduleId),
        sortColumn: SCHEDULE_WORKFLOWS_VISIBILITY_SORT_COLUMN,
        sortOrder: SCHEDULE_WORKFLOWS_VISIBILITY_SORT_ORDER,
        pageSize: params.pageSize.toString(),
      },
    });

    expect(request).toHaveBeenCalledWith(expectedUrl);
  });

  it('does not include search or archived listType in the request URL', async () => {
    const options = getListWorkflowsForScheduleQueryOptions(params);
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
    const options = getListWorkflowsForScheduleQueryOptions(params);
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
});
