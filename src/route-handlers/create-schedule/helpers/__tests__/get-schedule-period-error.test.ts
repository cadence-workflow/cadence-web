import getSchedulePeriodError from '../get-schedule-period-error';

describe(getSchedulePeriodError.name, () => {
  it('returns null when only start or end is provided', () => {
    expect(getSchedulePeriodError('2026-06-23T12:00:00.000Z')).toBeNull();
    expect(
      getSchedulePeriodError(undefined, '2026-06-30T12:00:00.000Z')
    ).toBeNull();
  });

  it('returns null when start is before end', () => {
    expect(
      getSchedulePeriodError(
        '2026-06-23T12:00:00.000Z',
        '2026-06-30T12:00:00.000Z'
      )
    ).toBeNull();
  });

  it('returns an error when start is not before end', () => {
    expect(
      getSchedulePeriodError(
        '2026-06-30T12:00:00.000Z',
        '2026-06-23T12:00:00.000Z'
      )
    ).toEqual({
      message: 'Start date must be before end date',
    });
  });
});
