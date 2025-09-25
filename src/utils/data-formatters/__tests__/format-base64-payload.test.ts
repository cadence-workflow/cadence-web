import formatBase64Payload from '../format-base64-payload';

describe('formatBase64Payload', () => {
  it('should decode mixed language from base64 correctly', () => {
    const result = formatBase64Payload(
      'RW5nbGlzaCwg0KDRg9GB0YHQutC40LksIOS4reaWhywg2KfZhNi52LHYqNmK2KksINei15HXqNeZ16o='
    );

    expect(result).toBe('English, Русский, 中文, العربية, עברית');
  });

  it('should decode "ЕГ" from known base64 encoding', () => {
    const result = formatBase64Payload('0JXQkw==');
    expect(result).toBe('ЕГ');
  });

  it('should decode "Hello World" from known base64 encoding', () => {
    const result = formatBase64Payload('SGVsbG8gV29ybGQ=');
    expect(result).toBe('Hello World');
  });

  it('should decode emoji from known base64 encoding', () => {
    const result = formatBase64Payload('8J+agA==');
    expect(result).toBe('🚀');
  });
});
