import getColumnIdsLocalStorageKey from '../get-column-ids-local-storage-key';

describe(getColumnIdsLocalStorageKey.name, () => {
  it('returns the expected local storage key for a given domain', () => {
    expect(getColumnIdsLocalStorageKey('my-domain')).toBe('columns_my-domain');
  });
});
