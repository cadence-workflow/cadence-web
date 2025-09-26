import { type Result } from 'cron-validate/lib/result';
import { type Options } from 'cron-validate/lib/types';

import { cronValidate } from '@/utils/cron-validate/cron-validate';
import { type CronData } from '@/utils/cron-validate/cron-validate.types';

import { getCronFieldsError } from '../get-cron-fields-error';

jest.mock('@/utils/cron-validate/cron-validate');

const mockCronValidate = cronValidate as jest.MockedFunction<
  typeof cronValidate
>;

describe('getCronFieldsError', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null for valid cron expression', () => {
    const { result } = setup({
      isValid: true,
    });

    expect(result).toBeNull();
  });

  it('should handle field-specific errors correctly', () => {
    const { result } = setup({
      isValid: false,
      errors: [
        'Invalid value for minutes field: x',
        'Invalid value for hours field: x',
        'Invalid value for daysOfMonth field: x',
        'Invalid value for months field: x',
        'Invalid value for daysOfWeek field: x',
      ],
    });

    expect(result).toEqual({
      minutes: 'Invalid value for minutes field: 70',
      hours: 'Invalid value for hours field: 25',
      daysOfWeek: 'Invalid value for daysOfWeek field: 8',
      daysOfMonth: 'Invalid value for daysOfMonth field: x',
      months: 'Invalid value for months field: x',
    });
  });

  it('should return general error when errors array has no field-specific matches', () => {
    const { result } = setup({
      isValid: false,
      errors: ['Malformed cron expression', 'Cannot parse input'],
    });

    expect(result).toEqual({
      general: 'Malformed cron expression',
    });
  });

  it('should handle mixed field-specific and general errors', () => {
    const { result } = setup({
      isValid: false,
      errors: [
        'Invalid value for minutes field: abc',
        'Syntax error in expression',
        'Invalid value for hours field: xyz',
      ],
    });

    // Should prioritize field-specific errors over general ones
    expect(result).toEqual({
      minutes: 'Invalid value for minutes field: abc',
      hours: 'Invalid value for hours field: xyz',
    });
  });
});

function setup({
  cronText = '* * * * *',
  isValid = true,
  errors = [],
}: {
  cronText?: string;
  isValid?: boolean;
  errors?: string[];
}) {
  // Giving type for cron result is not straightforward, because of the conditional type within it
  // So we make sure we are correctly creating partial mock and cast it to any
  const mockCronResult = {
    isValid: jest.fn(() => isValid),
    getError: jest.fn(() => errors),
  } satisfies Partial<Result<Options | CronData, string[]>> as any;

  mockCronValidate.mockReturnValue(mockCronResult);

  const result = getCronFieldsError(cronText);

  return {
    result,
    mockCronResult,
    mockIsValid: mockCronResult.isValid,
    mockGetError: mockCronResult.getError,
  };
}
