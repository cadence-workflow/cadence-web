import formatBase64Payload from '../format-base64-payload';

describe('formatBase64Payload', () => {
  it('should decode English text from base64 correctly', () => {
    const result = formatBase64Payload('RW5nbGlzaA==');
    expect(result).toBe('English');
  });

  it('should decode Russian text from base64 correctly', () => {
    const result = formatBase64Payload('0KDRg9GB0YHQutC40Lk=');
    expect(result).toBe('Русский');
  });

  it('should decode Chinese text from base64 correctly', () => {
    const result = formatBase64Payload('5Lit5paH');
    expect(result).toBe('中文');
  });

  it('should decode Arabic text from base64 correctly', () => {
    const result = formatBase64Payload('2KfZhNi52LHYqNmK2Kk=');
    expect(result).toBe('العربية');
  });

  it('should decode Cyrillic text from base64 correctly', () => {
    const result = formatBase64Payload('0JXQkw==');
    expect(result).toBe('ЕГ');
  });

  it('should decode emoji from base64 correctly', () => {
    const result = formatBase64Payload('8J+agA==');
    expect(result).toBe('🚀');
  });
});
