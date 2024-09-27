import formatFailureDetails from '../format-failure-details';

describe('formatFailureDetails', () => {
  test('should return null if failure details are not provided', () => {
    const failure = {};
    // @ts-expect-error Testing with wrong type `{}`
    expect(formatFailureDetails(failure)).toBeNull();
  });

  test('should return null if failure details are null', () => {
    const failure = { details: null };
    // @ts-expect-error Testing with wrong type `{ details: null}`
    expect(formatFailureDetails(failure)).toBeNull();
  });

  test('should decode and parse JSON failure details', () => {
    const failure = { details: btoa(JSON.stringify({ key: 'value' })) };
    expect(formatFailureDetails(failure)).toEqual({ key: 'value' });
  });

  test('should return decoded failure details if JSON parsing fails', () => {
    const failure = { details: btoa('not a valid JSON') };
    expect(formatFailureDetails(failure)).toBe('not a valid JSON');
  });

  test('should handle empty string as failure details', () => {
    const failure = { details: '' };
    expect(formatFailureDetails(failure)).toBe(null);
  });

  test('should handle base64 encoded failure details without JSON', () => {
    const failure = { details: btoa('just some text') };
    expect(formatFailureDetails(failure)).toBe('just some text');
  });
});
