import getLocalStorageValue from '../get-local-storage-value';

describe('getLocalStorageValue', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the value from localStorage.getItem', () => {
    const mockValue = 'test-value';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockValue);

    const result = getLocalStorageValue('test-key');

    expect(result).toBe(mockValue);
  });

  it('should return null when localStorage.getItem returns null', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const result = getLocalStorageValue('test-key');

    expect(result).toBeNull();
  });
});
