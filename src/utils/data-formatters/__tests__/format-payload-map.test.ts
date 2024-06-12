import formatPayload from '../format-payload';
import formatPayloadMap from '../format-payload-map';

jest.mock('../format-payload', () =>
  jest.fn().mockImplementation((value) => JSON.stringify(value))
);

describe('formatPayloadMap', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return null if map is not provided', () => {
    expect(formatPayloadMap(undefined, 'someKey')).toBeNull();
  });

  test('should return null if map is null', () => {
    expect(formatPayloadMap(null, 'someKey')).toBeNull();
  });

  test('should return null if fieldKey is not present in map', () => {
    const map = { otherKey: { subkey: { value: 'test' } } };
    expect(formatPayloadMap(map, 'someKey')).toBeNull();
  });

  test('should return null if fieldKey value is null', () => {
    const map = { someKey: null };
    expect(formatPayloadMap(map, 'someKey')).toBeNull();
  });

  test('should format payload map correctly for valid input', () => {
    const map = {
      someKey: {
        subkey1: { value: 'test1' },
        subkey2: { value: 'test2' },
      },
    };
    const expectedFormattedPayload = {
      someKey: {
        subkey1: JSON.stringify({ value: 'test1' }),
        subkey2: JSON.stringify({ value: 'test2' }),
      },
    };

    expect(formatPayloadMap(map, 'someKey')).toEqual(expectedFormattedPayload);
    expect(formatPayload).toHaveBeenCalledWith({ value: 'test1' });
    expect(formatPayload).toHaveBeenCalledWith({ value: 'test2' });
  });
});
