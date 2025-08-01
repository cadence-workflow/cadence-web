import { z } from 'zod';

import getLocalStorageValue from '../get-local-storage-value';

const testSchema = z.string().startsWith('test-');

describe('getLocalStorageValue', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the value from localStorage.getItem', () => {
    const mockValue = 'test-value';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockValue);

    const result = getLocalStorageValue('test-key', testSchema);

    expect(result).toBe(mockValue);
  });

  it('should return null when localStorage.getItem returns null', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    const result = getLocalStorageValue('test-key', testSchema);

    expect(result).toBeNull();
  });

  it('should return null if the value in localStorage does not match the schema', () => {
    const mockValue = 'invalid-value';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockValue);

    const result = getLocalStorageValue('test-key', testSchema);

    expect(result).toBeNull();
  });

  it('should return plain string when a schema is not provided', () => {
    const mockValue = 'mock-value';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockValue);

    const result = getLocalStorageValue('test-key');

    expect(result).toBe('mock-value');
  });

  it('should return empty string when localStorage.getItem returns empty string', () => {
    const mockValue = '';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockValue);

    const result = getLocalStorageValue('test-key');

    expect(result).toBe('');
  });
});
