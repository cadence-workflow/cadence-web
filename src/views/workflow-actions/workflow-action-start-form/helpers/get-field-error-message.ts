import get from 'lodash/get';

/**
 * Extracts a simple error message from react-hook-form field errors.
 * This is the default behavior for most form fields.
 */
export default function getFieldErrorMessage(
  fieldErrors: Record<string, any>,
  field: string
): string | undefined {
  const error = get(fieldErrors, field);

  return error?.message;
}
