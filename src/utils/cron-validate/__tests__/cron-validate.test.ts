import cron, { type CronData } from 'cron-validate';
import { type Err, type Valid } from 'cron-validate/lib/result';
import { type InputOptions } from 'cron-validate/lib/types';

import { cronValidate } from '../cron-validate';
import {
  CRON_VALIDATE_CADENCE_PRESET_ID,
  CRON_VALIDATE_CADENCE_PRESET,
} from '../cron-validate.constants';

// Mock the cron-validate library to test our wrapper behavior
jest.mock('cron-validate');
jest.mock('cron-validate/lib/option');

describe('cronValidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('should call cron-validate with Cadence preset by default', () => {
    const { mockResult, mockCron } = setup();

    const cronString = '0 12 * * *';
    const result = cronValidate(cronString);

    expect(mockCron).toHaveBeenCalledWith(cronString, {
      preset: CRON_VALIDATE_CADENCE_PRESET_ID,
    });
    expect(result).toBe(mockResult);
  });

  it('should merge custom options with preset', () => {
    const cronString = '0 12 * * *';
    const customOptions = {
      override: {
        minutes: {
          lowerLimit: 5,
          upperLimit: 55,
        },
      },
    };
    const { mockResult, mockCron, result } = setup({
      value: cronString,
      options: customOptions,
    });

    expect(mockCron).toHaveBeenCalledWith(cronString, {
      override: {
        minutes: {
          lowerLimit: 5,
          upperLimit: 55,
        },
      },
      preset: CRON_VALIDATE_CADENCE_PRESET_ID,
    });
    expect(result).toBe(mockResult);
  });

  it('should return the exact result from cron-validate library', () => {
    const { mockResult, result } = setup({
      mockIsValid: false,
      mockErrors: ['Test error message'],
      mockCronValue: {
        minutes: '0',
        hours: '12',
        daysOfMonth: '1',
        months: '1',
        daysOfWeek: '1',
      },
    });

    expect(result).toBe(mockResult);
  });

  it('should handle empty options parameter', () => {
    const { mockCron } = setup({
      value: '*/5 * * * *',
    });

    expect(mockCron).toHaveBeenCalledWith('*/5 * * * *', {
      preset: CRON_VALIDATE_CADENCE_PRESET_ID,
    });
  });

  it('should handle undefined options parameter', () => {
    const { mockCron } = setup({
      value: '0 0 * * 1-5',
    });

    expect(mockCron).toHaveBeenCalledWith('0 0 * * 1-5', {
      preset: CRON_VALIDATE_CADENCE_PRESET_ID,
    });
  });

  it('should allow overriding the preset when custom preset option is provided', () => {
    const options: InputOptions = {
      preset: 'some-other-preset',
      override: {
        minutes: {
          lowerLimit: 0,
          upperLimit: 30,
        },
      },
    };
    const value = '0 12 * * *';
    const { mockCron } = setup({
      value,
      options,
    });

    expect(mockCron).toHaveBeenCalledWith(value, options);
  });
});

type CronValidateResult = Valid<CronData, string[]> | Err<CronData, string[]>;
type SetupOptions = {
  mockIsValid?: ReturnType<CronValidateResult['isValid']>;
  mockErrors?: ReturnType<CronValidateResult['getError']>;
  mockCronValue?: ReturnType<CronValidateResult['getValue']>;
  value?: string;
  options?: InputOptions;
};

function setup({
  mockIsValid = true,
  mockErrors = [],
  mockCronValue = {
    minutes: '0',
    hours: '12',
    daysOfMonth: '1',
    months: '1',
    daysOfWeek: '1',
  },
  value = '0 12 * * *',
  options,
}: SetupOptions = {}) {
  const mockResult: Partial<CronValidateResult> = {
    isValid: jest.fn(() => mockIsValid),
    isError: jest.fn(() => !mockIsValid),
    getError: jest.fn(() => mockErrors),
    getValue: jest.fn(() => mockCronValue),
  };

  const mockCron = cron as jest.MockedFunction<typeof cron>;
  mockCron.mockReturnValue(mockResult as CronValidateResult);

  const result = cronValidate(value, options);

  return { mockResult, mockCron, cronValidate, result };
}
