import getMultiJsonErrorMessage from '../get-multi-json-error-message';

describe('getMultiJsonErrorMessage', () => {
  it('should return undefined when field has no error', () => {
    const fieldErrors = {};

    const result = getMultiJsonErrorMessage(fieldErrors, 'input');

    expect(result).toBeUndefined();
  });

  it('should return string message when field is not an array', () => {
    const fieldErrors = {
      input: {
        message: 'Single error',
        type: 'invalid',
      },
    };

    const result = getMultiJsonErrorMessage(fieldErrors, 'input');

    expect(result).toBe('Single error');
  });

  it('should return array of messages for array field errors including undefined', () => {
    const fieldErrors = {
      input: [
        { message: 'Invalid JSON at index 0', type: 'invalid' },
        { message: 'Invalid JSON at index 1', type: 'invalid' },
        undefined,
        { message: 'Invalid JSON at index 3', type: 'invalid' },
      ],
    };

    const result = getMultiJsonErrorMessage(fieldErrors, 'input');

    expect(result).toEqual([
      'Invalid JSON at index 0',
      'Invalid JSON at index 1',
      undefined,
      'Invalid JSON at index 3',
    ]);
  });

  it('should return empty array for empty array of errors', () => {
    const fieldErrors = {
      input: [],
    };

    const result = getMultiJsonErrorMessage(fieldErrors, 'input');

    expect(result).toEqual([]);
  });

  it('should return array including undefined for null/undefined entries', () => {
    const fieldErrors = {
      input: [
        { message: 'Error 1', type: 'invalid' },
        undefined,
        { message: 'Error 2', type: 'invalid' },
        null,
      ],
    };

    const result = getMultiJsonErrorMessage(fieldErrors, 'input');

    expect(result).toEqual(['Error 1', undefined, 'Error 2', undefined]);
  });

  it('should handle arrays with empty entries', () => {
    // array with [Empty] entries
    const fieldErrors = {
      input: new Array(3),
    };
    fieldErrors.input[1] = { message: 'Error 1', type: 'invalid' };

    const result = getMultiJsonErrorMessage(fieldErrors, 'input');

    expect(result).toEqual([undefined, 'Error 1', undefined]);
  });
});
