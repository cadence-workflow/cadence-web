import decodeUrlParams from '../decode-url-params';

describe('decodeUrlParams', () => {
  it('should decode URL params correctly', () => {
    const params = {
      name: 'John%20Doe',
      age: '30',
      city: 'New%20York',
    };
    const decodedParams = decodeUrlParams(params);
    expect(decodedParams).toEqual({
      name: 'John Doe',
      age: '30',
      city: 'New York',
    });
  });

  it('should handle empty params object', () => {
    const params = {};
    const decodedParams = decodeUrlParams(params);
    expect(decodedParams).toEqual({});
  });

  it('should handle special characters correctly', () => {
    const params = {
      message: 'Hello%21%20How%20are%20you%3F',
    };
    const decodedParams = decodeUrlParams(params);
    expect(decodedParams).toEqual({
      message: 'Hello! How are you?',
    });
  });

  it('should decode all params correctly', () => {
    const params = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    const decodedParams = decodeUrlParams(params);
    expect(decodedParams).toEqual(params);
  });
});
