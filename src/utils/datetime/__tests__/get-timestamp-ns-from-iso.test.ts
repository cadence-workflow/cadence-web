import getTimestampNsFromISO from '../get-timestamp-ns-from-iso';

describe('getTimestampNsFromISO', () => {
  it('should get the timestamp in nanoseconds given the ISO 8601 date', () => {
    expect(getTimestampNsFromISO('2024-04-02T22:15:00.000Z')).toEqual(
      '1712096100000000000'
    );
  });
});
