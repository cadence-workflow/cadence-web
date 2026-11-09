import isSameSearch from '../is-same-search';

describe(isSameSearch.name, () => {
  it('treats key order and serializer differences as equal', () => {
    expect(isSameSearch('a=1&b=2', 'b=2&a=1')).toBe(true);
    expect(isSameSearch('q=a%20b', 'q=a+b')).toBe(true);
  });

  it('keeps bare keys distinct from empty values', () => {
    expect(isSameSearch('filter', 'filter=')).toBe(false);
  });

  it('detects value changes and missing keys', () => {
    expect(isSameSearch('a=1', 'a=2')).toBe(false);
    expect(isSameSearch('a=1&b=2', 'a=1')).toBe(false);
    expect(isSameSearch('', '')).toBe(true);
  });
});
