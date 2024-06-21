import formatDate from '../format-date';

jest.useFakeTimers().setSystemTime(new Date('2023-05-25'));

describe(formatDate.name, () => {
  it('returns formatted date for the current year', () => {
    expect(formatDate(new Date('2023-01-01T12:34:56').getTime())).toEqual(
      '01 Jan, 12:34:56 GMT+0'
    );
  });

  it('returns formatted date for a prior year', () => {
    expect(formatDate(new Date('2022-01-01T12:34:56').getTime())).toEqual(
      '01 Jan 2022, 12:34:56 GMT+0'
    );
  });
});
