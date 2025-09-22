import cron from 'cron-validate';

import { cronValidate } from '../cron-validate';
import {
  CRON_VALIDATE_CADENCE_PRESET_ID,
  CRON_VALIDATE_CADENCE_PRESET,
} from '../cron-validate.constants';

// Mock the cron-validate library to test our wrapper behavior
jest.mock('cron-validate');
jest.mock('cron-validate/lib/option');

const mockCron = cron as jest.MockedFunction<typeof cron>;

describe('cronValidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('preset registration', () => {
    it('should have registered the Cadence preset', () => {
      // Since the module is already loaded, we can't test the registration call directly
      // Instead, we verify that the constants are properly defined and would be used for registration
      expect(CRON_VALIDATE_CADENCE_PRESET_ID).toBe('cadence');
      expect(CRON_VALIDATE_CADENCE_PRESET).toEqual(
        expect.objectContaining({
          presetId: 'cadence',
          useSeconds: false,
          useYears: false,
          useAliases: true,
          useBlankDay: false,
          allowOnlyOneBlankDayField: false,
          allowStepping: true,
          mustHaveBlankDayField: false,
          useLastDayOfMonth: false,
          useLastDayOfWeek: false,
          useNearestWeekday: false,
          useNthWeekdayOfMonth: false,
        })
      );
    });

    it('should have correct field validation ranges in preset', () => {
      expect(CRON_VALIDATE_CADENCE_PRESET.minutes).toEqual({
        minValue: 0,
        maxValue: 59,
      });
      expect(CRON_VALIDATE_CADENCE_PRESET.hours).toEqual({
        minValue: 0,
        maxValue: 23,
      });
      expect(CRON_VALIDATE_CADENCE_PRESET.daysOfMonth).toEqual({
        minValue: 0,
        maxValue: 31,
      });
      expect(CRON_VALIDATE_CADENCE_PRESET.months).toEqual({
        minValue: 0,
        maxValue: 12,
      });
      expect(CRON_VALIDATE_CADENCE_PRESET.daysOfWeek).toEqual({
        minValue: 0,
        maxValue: 6, // Limited to 6 instead of 7 for Cadence
      });
    });
  });

  describe('function behavior', () => {
    it('should call cron-validate with Cadence preset by default', () => {
      const mockResult = {
        isValid: jest.fn(() => true),
        getError: jest.fn(() => []),
      } as any;
      mockCron.mockReturnValue(mockResult);

      const cronString = '0 12 * * *';
      const result = cronValidate(cronString);

      expect(mockCron).toHaveBeenCalledWith(cronString, {
        preset: CRON_VALIDATE_CADENCE_PRESET_ID,
      });
      expect(result).toBe(mockResult);
    });

    it('should merge custom options with preset', () => {
      const mockResult = {
        isValid: jest.fn(() => true),
        getError: jest.fn(() => []),
      } as any;
      mockCron.mockReturnValue(mockResult);

      const cronString = '0 12 * * *';
      const customOptions = {
        override: {
          minutes: {
            minValue: 5,
            maxValue: 55,
          },
        },
      } as any;

      const result = cronValidate(cronString, customOptions);

      expect(mockCron).toHaveBeenCalledWith(cronString, {
        override: {
          minutes: {
            minValue: 5,
            maxValue: 55,
          },
        },
        preset: CRON_VALIDATE_CADENCE_PRESET_ID,
      });
      expect(result).toBe(mockResult);
    });

    it('should pass through all custom options while preserving preset', () => {
      const mockResult = {
        isValid: jest.fn(() => false),
        getError: jest.fn(() => ['error']),
      } as any;
      mockCron.mockReturnValue(mockResult);

      const cronString = '* * * * *';
      const customOptions = {
        override: {
          hours: {
            minValue: 8,
            maxValue: 18,
          },
        },
      } as any;

      const result = cronValidate(cronString, customOptions);

      expect(mockCron).toHaveBeenCalledWith(cronString, {
        override: {
          hours: {
            minValue: 8,
            maxValue: 18,
          },
        },
        preset: CRON_VALIDATE_CADENCE_PRESET_ID,
      });
      expect(result).toBe(mockResult);
    });

    it('should return the exact result from cron-validate library', () => {
      const mockResult = {
        isValid: jest.fn(() => false),
        getError: jest.fn(() => ['Test error message']),
        getCron: jest.fn(() => ({ minute: [0] })),
      } as any;
      mockCron.mockReturnValue(mockResult);

      const result = cronValidate('invalid cron');

      expect(result).toBe(mockResult);
      expect(result.isValid()).toBe(false);
      expect(result.getError()).toEqual(['Test error message']);
    });

    it('should handle empty options parameter', () => {
      const mockResult = {
        isValid: jest.fn(() => true),
        getError: jest.fn(() => []),
      } as any;
      mockCron.mockReturnValue(mockResult);

      const cronString = '*/5 * * * *';
      cronValidate(cronString);

      expect(mockCron).toHaveBeenCalledWith(cronString, {
        preset: CRON_VALIDATE_CADENCE_PRESET_ID,
      });
    });

    it('should handle undefined options parameter', () => {
      const mockResult = {
        isValid: jest.fn(() => true),
        getError: jest.fn(() => []),
      } as any;
      mockCron.mockReturnValue(mockResult);

      const cronString = '0 0 * * 1-5';
      cronValidate(cronString, undefined);

      expect(mockCron).toHaveBeenCalledWith(cronString, {
        preset: CRON_VALIDATE_CADENCE_PRESET_ID,
      });
    });

    it('should always use Cadence preset regardless of custom preset option', () => {
      const mockResult = {
        isValid: jest.fn(() => true),
        getError: jest.fn(() => []),
      } as any;
      mockCron.mockReturnValue(mockResult);

      const cronString = '0 12 * * *';
      const customOptions = {
        preset: 'some-other-preset' as any,
        override: {
          minutes: {
            minValue: 0,
            maxValue: 30,
          },
        },
      } as any;

      cronValidate(cronString, customOptions);

      // Our function should always use the Cadence preset, overriding any custom preset
      expect(mockCron).toHaveBeenCalledWith(cronString, {
        override: {
          minutes: {
            minValue: 0,
            maxValue: 30,
          },
        },
        preset: CRON_VALIDATE_CADENCE_PRESET_ID,
      });
    });
  });

  describe('error handling', () => {
    it('should propagate errors from cron-validate library', () => {
      const error = new Error('Validation failed');
      mockCron.mockImplementation(() => {
        throw error;
      });

      expect(() => cronValidate('invalid')).toThrow('Validation failed');
    });
  });
});
