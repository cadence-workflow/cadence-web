import {
  DATE_TIME_FORMAT_MINUTES,
  DATE_TIME_FORMAT_SECONDS,
} from '../../date-time-picker.constants';
import parseDateTimeValue from '../parse-date-time-value';

describe(parseDateTimeValue.name, () => {
  it('parses minutes format strictly and emits UTC ISO', () => {
    const iso = parseDateTimeValue(
      '2024/06/15 14:30',
      DATE_TIME_FORMAT_MINUTES
    );
    expect(iso).toBeDefined();
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('parses seconds format', () => {
    expect(
      parseDateTimeValue('2024-06-15 14:30:45', DATE_TIME_FORMAT_SECONDS)
    ).toBeDefined();
  });

  it('rejects partial and date-fns token leftovers', () => {
    expect(
      parseDateTimeValue('2024/06/15', DATE_TIME_FORMAT_MINUTES)
    ).toBeUndefined();
    expect(
      parseDateTimeValue('yyyy/MM/dd HH:mm', DATE_TIME_FORMAT_MINUTES)
    ).toBeUndefined();
  });

  it('rejects ISO paste (no dedicated ISO branch)', () => {
    expect(
      parseDateTimeValue('2024-06-15T14:30:00.000Z', DATE_TIME_FORMAT_MINUTES)
    ).toBeUndefined();
  });

  it('returns undefined for empty', () => {
    expect(parseDateTimeValue('  ', DATE_TIME_FORMAT_MINUTES)).toBeUndefined();
  });
});
