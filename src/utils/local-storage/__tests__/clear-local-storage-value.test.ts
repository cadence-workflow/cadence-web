import clearLocalStorageValue from '../clear-local-storage-value';

describe(clearLocalStorageValue, () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should call localStorage.removeItem with the provided key', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    clearLocalStorageValue('test-key');

    expect(removeItemSpy).toHaveBeenCalledWith('test-key');
  });
});
