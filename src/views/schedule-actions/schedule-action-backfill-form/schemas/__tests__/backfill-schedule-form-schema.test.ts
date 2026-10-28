import { DATE_TIME_FORMAT_MINUTES } from '@/components/date-time-picker/date-time-picker.constants';
import parseDateTimeValue from '@/components/date-time-picker/helpers/parse-date-time-value';

import { backfillScheduleFormSchema } from '../backfill-schedule-form-schema';

const VALID_PERIOD = {
  startTime: '2026-01-01T00:00:00Z',
  endTime: '2026-01-02T00:00:00Z',
};

describe('backfill validation messages', () => {
  describe.each(['startTime', 'endTime'] as const)('%s', (field) => {
    const requiredMessage =
      field === 'startTime' ? 'Start date is required' : 'End date is required';

    it.each([
      [undefined, undefined],
      [null, 'Invalid input: expected string, received null'],
      [1, 'Invalid input: expected string, received number'],
      [false, 'Invalid input: expected string, received boolean'],
      [{}, 'Invalid input: expected string, received object'],
      ['', undefined],
      ['not-a-date', undefined],
    ])(
      'preserves required/type/format message precedence for %p',
      (value, defaultMessage) => {
        const result = backfillScheduleFormSchema.safeParse({
          ...VALID_PERIOD,
          [field]: value,
        });
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]).toEqual(
          expect.objectContaining({
            path: [field],
            message: defaultMessage ?? requiredMessage,
          })
        );
      }
    );
  });

  it('keeps both minimum-length and datetime messages for each empty date', () => {
    const result = backfillScheduleFormSchema.safeParse({
      startTime: '',
      endTime: '',
    });
    expect(
      result.error?.issues.map(({ path, message }) => ({ path, message }))
    ).toEqual([
      { path: ['startTime'], message: 'Start date is required' },
      { path: ['startTime'], message: 'Start date is required' },
      { path: ['endTime'], message: 'End date is required' },
      { path: ['endTime'], message: 'End date is required' },
    ]);
  });

  it('keeps the cross-field error on startTime', () => {
    const result = backfillScheduleFormSchema.safeParse({
      startTime: VALID_PERIOD.endTime,
      endTime: VALID_PERIOD.startTime,
    });
    expect(result.error?.issues).toEqual([
      expect.objectContaining({
        path: ['startTime'],
        code: 'custom',
        message: 'Start date must be before end date',
      }),
    ]);
  });
});

describe('backfill data and error parity', () => {
  it('accepts date-picker output with seconds without changing it', () => {
    const input = {
      startTime: parseDateTimeValue(
        '2026/01/01 00:00',
        DATE_TIME_FORMAT_MINUTES
      ),
      endTime: parseDateTimeValue('2026/01/02 00:00', DATE_TIME_FORMAT_MINUTES),
    };
    expect(input.startTime).toBeDefined();
    expect(input.endTime).toBeDefined();
    expect(backfillScheduleFormSchema.parse(input)).toEqual(input);
  });
});
