import { getDomainObj } from '../../__fixtures__/domains';
import { mockDomainsPageQueryParamsValues } from '../../__fixtures__/domains-page-query-params';
import { type DomainsPageContextType } from '../../domains-page-context-provider/domains-page-context-provider.types';
import filterDomainsBySearchText from '../filter-domains-by-search-text';

const pageCtx = {
  mockContextValue: 'mock',
} as unknown as DomainsPageContextType;

describe(filterDomainsBySearchText.name, () => {
  it('passes every domain when the search text is empty', () => {
    expect(runFilter({ searchText: '' })).toBe(true);
  });

  it('passes when the name contains the search text, ignoring case', () => {
    expect(runFilter({ searchText: 'ALPHA' })).toBe(true);
  });

  it('passes when the id equals the search text, ignoring case', () => {
    expect(runFilter({ searchText: 'ABC123' })).toBe(true);
  });

  it('fails when the search text is only part of the id', () => {
    expect(runFilter({ searchText: 'abc' })).toBe(false);
  });

  it('fails when nothing matches', () => {
    expect(runFilter({ searchText: 'no-match' })).toBe(false);
  });
});

function runFilter({ searchText }: { searchText: string }) {
  const domain = getDomainObj({ id: 'abc123', name: 'alpha-domain' });
  return filterDomainsBySearchText(
    domain,
    { ...mockDomainsPageQueryParamsValues, searchText },
    pageCtx
  );
}
