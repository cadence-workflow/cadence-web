import getDateDaysBeforeToday from '../get-date-days-before-today';

jest.useFakeTimers().setSystemTime(new Date('2023-05-25'));

describe(getDateDaysBeforeToday.name, () => {
  it('should return date 30 days before today', () => {
    expect(getDateDaysBeforeToday(30)).toEqual(
      new Date('2023-04-25T00:00:00.000Z')
    );
  });

  it('should return date 0 days before today', () => {
    expect(getDateDaysBeforeToday(0)).toEqual(
      new Date('2023-05-25T00:00:00.000Z')
    );
  });
});
