import getSearchAttributesErrorMessage from '../get-search-attributes-error-message';

describe('getSearchAttributesErrorMessage', () => {
  it('should return undefined for null or undefined errors', () => {
    expect(getSearchAttributesErrorMessage(null)).toBeUndefined();
    expect(getSearchAttributesErrorMessage(undefined)).toBeUndefined();
  });

  it('should handle array of search attribute errors with key and value', () => {
    const errors = [
      {
        key: { message: 'Key is required' },
        value: { message: 'Value is required' },
      },
      {
        key: { message: 'Invalid key format' },
        value: { message: 'Invalid value format' },
      },
    ];

    const result = getSearchAttributesErrorMessage(errors);

    expect(result).toEqual([
      { key: 'Key is required', value: 'Value is required' },
      { key: 'Invalid key format', value: 'Invalid value format' },
    ]);
  });

  it('should handle array with only key errors', () => {
    const errors = [
      {
        key: { message: 'Key is required' },
      },
      {
        key: { message: 'Invalid key format' },
      },
    ];

    const result = getSearchAttributesErrorMessage(errors);

    expect(result).toEqual([
      { key: 'Key is required', value: '' },
      { key: 'Invalid key format', value: '' },
    ]);
  });

  it('should handle array with only value errors', () => {
    const errors = [
      {
        value: { message: 'Value is required' },
      },
      {
        value: { message: 'Invalid value format' },
      },
    ];

    const result = getSearchAttributesErrorMessage(errors);

    expect(result).toEqual([
      { key: '', value: 'Value is required' },
      { key: '', value: 'Invalid value format' },
    ]);
  });

  it('should handle array with null/undefined elements', () => {
    const errors = [
      {
        key: { message: 'Key error' },
        value: { message: 'Value error' },
      },
      null,
      undefined,
      {
        key: { message: 'Another key error' },
      },
    ];

    const result = getSearchAttributesErrorMessage(errors);

    expect(result).toEqual([
      { key: 'Key error', value: 'Value error' },
      { key: '', value: '' },
      { key: '', value: '' },
      { key: 'Another key error', value: '' },
    ]);
  });

  it('should handle array with mixed error structures', () => {
    const errors = [
      {
        key: { message: 'Key error' },
        value: { message: 'Value error' },
      },
      {
        key: { type: 'required' }, // No message
        value: { type: 'invalid' }, // No message
      },
    ];

    const result = getSearchAttributesErrorMessage(errors);

    expect(result).toEqual([
      { key: 'Key error', value: 'Value error' },
      { key: '', value: '' },
    ]);
  });

  it('should handle single error object with message property', () => {
    const error = { message: 'Single error message' };

    const result = getSearchAttributesErrorMessage(error);

    expect(result).toBe('Single error message');
  });

  it('should handle empty array', () => {
    const result = getSearchAttributesErrorMessage([]);

    expect(result).toEqual([]);
  });

  it('should handle empty object without message property', () => {
    const result = getSearchAttributesErrorMessage({});

    expect(result).toBeUndefined();
  });

  it('should handle non-string message values gracefully', () => {
    const errors = [
      {
        key: { message: 123 }, // Non-string message
        value: { message: 'Valid message' },
      },
    ];

    const result = getSearchAttributesErrorMessage(errors);

    expect(result).toEqual([{ key: '', value: 'Valid message' }]);
  });

  it('should prioritize top-level message property', () => {
    const error = {
      message: 'Top level error',
      key: { message: 'Key error' },
      value: { message: 'Value error' },
    };

    const result = getSearchAttributesErrorMessage(error);

    expect(result).toBe('Top level error');
  });

  it('should handle errors without key or value properties', () => {
    const errors = [
      {
        someOtherProperty: { message: 'Some error' },
      },
    ];

    const result = getSearchAttributesErrorMessage(errors);

    expect(result).toEqual([{ key: '', value: '' }]);
  });
});
