import getListWorkflowsBasicQueryOptions from '../get-list-workflows-basic-query-options';

describe(getListWorkflowsBasicQueryOptions.name, () => {
  it('returns the expected output', () => {
    expect(
      getListWorkflowsBasicQueryOptions({
        domain: 'mock-domain',
        cluster: 'mock-cluster',
        requestQueryParams: {
          kind: 'open',
          pageSize: '10',
          timeRangeStart: '1733845163000',
          timeRangeEnd: '1733846163000',
        },
      })
    ).toMatchObject({
      queryKey: [
        'listWorkflowsBasic',
        {
          cluster: 'mock-cluster',
          domain: 'mock-domain',
          kind: 'open',
          pageSize: '10',
          timeRangeEnd: '1733846163000',
          timeRangeStart: '1733845163000',
        },
      ],
      initialPageParam: undefined,
      gcTime: 0,
      retry: false,
    });
  });
});
