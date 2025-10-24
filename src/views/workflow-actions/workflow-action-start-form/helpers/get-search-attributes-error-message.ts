import get from 'lodash/get';

/**
 * Extracts error messages from search attributes field errors.
 */
export default function getSearchAttributesErrorMessage(
  fieldErrors: Record<string, any>,
  fieldName: string
): string | Partial<Record<'key' | 'value', string>>[] | undefined {
  const fieldError = get(fieldErrors, fieldName);
  if (!fieldError) {
    return undefined;
  }

  if (Array.isArray(fieldError)) {
    return fieldError.map((err) => {
      const errorObj: Record<string, string> = {};

      if (err && typeof err === 'object') {
        if ('key' in err && err.key && typeof err.key === 'object') {
          if ('message' in err.key && typeof err.key.message === 'string') {
            errorObj.key = err.key.message;
          }
        }

        if ('value' in err && err.value && typeof err.value === 'object') {
          if ('message' in err.value && typeof err.value.message === 'string') {
            errorObj.value = err.value.message;
          }
        }
      }

      return errorObj;
    });
  }

  // Handle single error object with message property
  if (
    typeof fieldError === 'object' &&
    'message' in fieldError &&
    typeof fieldError.message === 'string'
  ) {
    return fieldError.message;
  }

  return undefined;
}
