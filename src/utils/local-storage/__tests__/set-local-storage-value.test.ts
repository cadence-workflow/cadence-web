import logger from '../../logger';
import setLocalStorageValue from '../set-local-storage-value';

jest.mock('@/utils/logger', () => ({
  warn: jest.fn(),
}));

describe(setLocalStorageValue.name, () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('should call localStorage.setItem with the provided key and value', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    setLocalStorageValue('test-key', 'test-value');

    expect(setItemSpy).toHaveBeenCalledWith('test-key', 'test-value');
  });

  it('should handle localStorage.setItem errors gracefully', () => {
    const mockError = new Error('Storage quota exceeded');
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw mockError;
    });

    setLocalStorageValue('test-key', 'test-value');

    expect(logger.warn).toHaveBeenCalledWith(
      { key: 'test-key', error: mockError, value: 'test-value' },
      'Failed to save value to local storage'
    );
  });
});
