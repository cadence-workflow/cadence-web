import getListDomainsQueryOptions from '../get-list-domains-query-options';

describe(getListDomainsQueryOptions.name, () => {
  it('returns the expected query options', () => {
    expect(
      getListDomainsQueryOptions({
        cluster: 'mock-cluster',
        pageSize: 100,
      })
    ).toMatchObject({
      queryKey: ['listDomains', 'mock-cluster'],
      initialPageParam: undefined,
      retry: false,
    });
  });

  it('returns undefined from getNextPageParam when nextPage is empty', () => {
    const options = getListDomainsQueryOptions({
      cluster: 'mock-cluster',
      pageSize: 100,
    });

    const lastPage = { domains: [], nextPage: '' };

    expect(
      options.getNextPageParam(lastPage, [lastPage], undefined, [undefined])
    ).toBeUndefined();
  });

  it('returns the token from getNextPageParam when nextPage is present', () => {
    const options = getListDomainsQueryOptions({
      cluster: 'mock-cluster',
      pageSize: 100,
    });

    const lastPage = { domains: [], nextPage: 'next-page-token' };

    expect(
      options.getNextPageParam(lastPage, [lastPage], undefined, [undefined])
    ).toBe('next-page-token');
  });

  it('returns false from refetchOnWindowFocus when query has error status', () => {
    const options = getListDomainsQueryOptions({
      cluster: 'mock-cluster',
      pageSize: 100,
    });

    const refetchOnWindowFocus = options.refetchOnWindowFocus as (query: {
      state: { status: string };
    }) => boolean;

    expect(refetchOnWindowFocus({ state: { status: 'error' } })).toBe(false);
    expect(refetchOnWindowFocus({ state: { status: 'success' } })).toBe(true);
  });
});
