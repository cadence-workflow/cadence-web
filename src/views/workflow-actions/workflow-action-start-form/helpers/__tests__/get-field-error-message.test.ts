import getFieldErrorMessage from '../get-field-error-message';

describe('getFieldErrorMessage', () => {
  it('should return undefined when field has no error', () => {
    const fieldErrors = {};

    const result = getFieldErrorMessage(fieldErrors, 'name');

    expect(result).toBeUndefined();
  });

  it('should return string message for simple field error', () => {
    const fieldErrors = {
      name: {
        message: 'Task list name is required',
        type: 'required',
      },
    };

    const result = getFieldErrorMessage(fieldErrors, 'name');

    expect(result).toBe('Task list name is required');
  });

  it('should handle nested field paths with dot notation', () => {
    const fieldErrors = {
      retryPolicy: {
        initialIntervalSeconds: {
          message: 'Invalid initial interval',
          type: 'invalid',
        },
      },
    };

    const result = getFieldErrorMessage(
      fieldErrors,
      'retryPolicy.initialIntervalSeconds'
    );

    expect(result).toBe('Invalid initial interval');
  });

  it('should return undefined for non-existent nested field', () => {
    const fieldErrors = {
      retryPolicy: {
        initialIntervalSeconds: {
          message: 'Invalid initial interval',
          type: 'invalid',
        },
      },
    };

    const result = getFieldErrorMessage(fieldErrors, 'retryPolicy.nonExistent');

    expect(result).toBeUndefined();
  });
});
