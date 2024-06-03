import parseDateQueryParam from '../parse-date-query-param';

describe('parseDateQueryParam', () => {
  it('should return a valid date object when a valid date string is provided', () => {
    const dateString = '2023-05-13T00:00:00.000Z';

    const result = parseDateQueryParam(dateString);

    expect(result?.getTime()).toEqual(1683936000000);
  });

  it('should return undefined when an empty string is provided', () => {
    const dateString = '';

    const result = parseDateQueryParam(dateString);

    expect(result).toBeUndefined();
  });

  it('should return undefined when an invalid date string is provided', () => {
    const dateString = '2023-13-13T00:00:00.000Z';

    const result = parseDateQueryParam(dateString);

    expect(result).toBeUndefined();
  });

  it('should return undefined when a non-date string is provided', () => {
    const dateString = 'abc';

    const result = parseDateQueryParam(dateString);

    expect(result).toBeUndefined();
  });
});
