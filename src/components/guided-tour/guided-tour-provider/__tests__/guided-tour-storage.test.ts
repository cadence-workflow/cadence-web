import {
  COMPLETED_TOURS_STORAGE_KEY,
  isTourCompleted,
  markTourCompleted,
} from '../guided-tour-storage';

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('guided-tour-storage', () => {
  describe('isTourCompleted', () => {
    it('returns false when nothing has been stored', () => {
      expect(isTourCompleted('any-tour')).toBe(false);
    });

    it('returns true when the tour id is in the completed map', () => {
      localStorage.setItem(
        COMPLETED_TOURS_STORAGE_KEY,
        JSON.stringify({ 'tour-a': true })
      );
      expect(isTourCompleted('tour-a')).toBe(true);
      expect(isTourCompleted('tour-b')).toBe(false);
    });

    it('returns false when stored value is malformed JSON', () => {
      localStorage.setItem(COMPLETED_TOURS_STORAGE_KEY, 'not-json');
      expect(isTourCompleted('tour-a')).toBe(false);
    });
  });

  describe('markTourCompleted', () => {
    it('writes the tour id into a fresh map', () => {
      markTourCompleted('tour-a');
      expect(
        JSON.parse(localStorage.getItem(COMPLETED_TOURS_STORAGE_KEY)!)
      ).toEqual({
        'tour-a': true,
      });
    });

    it('merges with existing completed tours', () => {
      localStorage.setItem(
        COMPLETED_TOURS_STORAGE_KEY,
        JSON.stringify({ 'tour-a': true })
      );
      markTourCompleted('tour-b');
      expect(
        JSON.parse(localStorage.getItem(COMPLETED_TOURS_STORAGE_KEY)!)
      ).toEqual({
        'tour-a': true,
        'tour-b': true,
      });
    });

    it('is a no-op when the tour is already completed', () => {
      localStorage.setItem(
        COMPLETED_TOURS_STORAGE_KEY,
        JSON.stringify({ 'tour-a': true })
      );
      const setSpy = jest.spyOn(Storage.prototype, 'setItem');
      markTourCompleted('tour-a');
      expect(setSpy).not.toHaveBeenCalled();
      setSpy.mockRestore();
    });
  });
});
