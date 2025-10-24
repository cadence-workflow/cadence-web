import get from 'lodash/get';
import isObjectLike from 'lodash/isObjectLike';

/**
 * Extracts error messages from object fields errors (a field with subfields).
 * Returns a map of field names to error messages.
 */
export default function getFieldObjectErrorMessages(
  fieldErrors: Record<string, any>,
  field: string
): string | Record<string, string> | undefined {
  const error = get(fieldErrors, field);

  if (error?.message) {
    return error.message;
  }

  if (isObjectLike(error)) {
    const entries = Object.entries(error);
    const result = entries.reduce(
      (acc, [key, err]: [string, any]) => {
        if (err?.message && typeof err.message === 'string') {
          acc[key] = err.message;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    return Object.keys(result).length > 0 ? result : undefined;
  }

  return undefined;
}
