import getSearchAttributesErrorMessage from '../get-search-attributes-error-message';

describe('getSearchAttributesErrorMessage', () => {
  const FIELD_NAME = 'searchAttributes';

  it('should return undefined when field does not exist', () => {
    const fieldErrors = {};
    const result = getSearchAttributesErrorMessage(fieldErrors, FIELD_NAME);

    expect(result).toBeUndefined();
  });

  it('should handle array of search attribute errors with key and value', () => {
    const fieldErrors = {
      [FIELD_NAME]: [
        {
          key: { message: 'Key is required' },
          value: { message: 'Value is required' },
        },
        {
          key: { message: 'Invalid key format' },
          value: { message: 'Invalid value format' },
        },
      ],
    };

    const result = getSearchAttributesErrorMessage(fieldErrors, FIELD_NAME);

    expect(result).toEqual([
      { key: 'Key is required', value: 'Value is required' },
      { key: 'Invalid key format', value: 'Invalid value format' },
    ]);
  });

  it('should handle array with only key errors', () => {
    const fieldErrors = {
      [FIELD_NAME]: [
        {
          key: { message: 'Key is required' },
        },
        {
          key: { message: 'Invalid key format' },
        },
      ],
    };

    const result = getSearchAttributesErrorMessage(fieldErrors, FIELD_NAME);

    expect(result).toEqual([
      { key: 'Key is required' },
      { key: 'Invalid key format' },
    ]);
  });

  it('should handle array with only value errors', () => {
    const fieldErrors = {
      [FIELD_NAME]: [
        {
          value: { message: 'Value is required' },
        },
        {
          value: { message: 'Invalid value format' },
        },
      ],
    };

    const result = getSearchAttributesErrorMessage(fieldErrors, FIELD_NAME);

    expect(result).toEqual([
      { value: 'Value is required' },
      { value: 'Invalid value format' },
    ]);
  });

  it('should handle array with null/undefined elements', () => {
    const fieldErrors = {
      [FIELD_NAME]: [
        {
          key: { message: 'Key error' },
          value: { message: 'Value error' },
        },
        null,
        undefined,
        {
          key: { message: 'Another key error' },
        },
      ],
    };

    const result = getSearchAttributesErrorMessage(fieldErrors, FIELD_NAME);

    expect(result).toEqual([
      { key: 'Key error', value: 'Value error' },
      {},
      {},
      { key: 'Another key error' },
    ]);
  });

  it('should handle single error object with message property', () => {
    const fieldErrors = {
      [FIELD_NAME]: { message: 'Single error message' },
    };

    const result = getSearchAttributesErrorMessage(fieldErrors, FIELD_NAME);

    expect(result).toBe('Single error message');
  });

  it('should handle empty array', () => {
    const fieldErrors = {
      [FIELD_NAME]: [],
    };

    const result = getSearchAttributesErrorMessage(fieldErrors, FIELD_NAME);

    expect(result).toEqual([]);
  });

  it('should handle empty object without message property', () => {
    const fieldErrors = {
      [FIELD_NAME]: {},
    };

    const result = getSearchAttributesErrorMessage(fieldErrors, FIELD_NAME);

    expect(result).toBeUndefined();
  });

  it('should handle non-string message values gracefully', () => {
    const fieldErrors = {
      [FIELD_NAME]: [
        {
          key: { message: 123 }, // Non-string message
          value: { message: 'Valid message' },
        },
      ],
    };

    const result = getSearchAttributesErrorMessage(fieldErrors, FIELD_NAME);

    expect(result).toEqual([{ value: 'Valid message' }]);
  });

  it('should handle nested field paths', () => {
    const fieldErrors = {
      nested: {
        deep: {
          field: [
            {
              key: { message: 'Nested key error' },
              value: { message: 'Nested value error' },
            },
          ],
        },
      },
    };

    const result = getSearchAttributesErrorMessage(
      fieldErrors,
      'nested.deep.field'
    );

    expect(result).toEqual([
      { key: 'Nested key error', value: 'Nested value error' },
    ]);
  });
});
