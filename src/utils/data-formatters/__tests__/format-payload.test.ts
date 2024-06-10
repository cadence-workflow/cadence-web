import formatPayload from '../format-payload';

describe('formatPayload', () => {
  it('should return null if payload data is null', () => {
    const payload = { data: null };
    expect(formatPayload(payload)).toBeNull();
  });

  it('should return null if payload data is undefined', () => {
    const payload = {};
    expect(formatPayload(payload)).toBeNull();
  });

  it('should parse JSON data correctly', () => {
    const payload = { data: btoa(JSON.stringify({ key: 'value' })) };
    expect(formatPayload(payload)).toEqual({ key: 'value' });
  });

  it('should remove double quotes from the string if JSON parsing fails', () => {
    const payload = { data: btoa('"Hello World"') };
    expect(formatPayload(payload)).toBe('Hello World');
  });

  it('should split string by newline character if it is in Array format', () => {
    const payload = { data: btoa('"item1\nitem2\nitem3"') };
    expect(formatPayload(payload)).toEqual(['item1', 'item2', 'item3']);
  });

  it('should return string as is if it does not contain newline character or double quotes', () => {
    const payload = { data: btoa('Hello World') };
    expect(formatPayload(payload)).toBe('Hello World');
  });
});
