import get from 'lodash/get';

/**
 * Extracts error messages from array field errors for multi-json-input components.
 * Returns only string error messages, filtering out any complex nested errors.
 */
export default function getMultiJsonErrorMessage(
  fieldErrors: Record<string, any>,
  field: string
): string | Array<string | undefined> | undefined {
  const error = get(fieldErrors, field);

  if (!error || !Array.isArray(error)) {
    return error?.message;
  }

  const messages = error.map((err) => {
    if (!err) return undefined;
    return err.message;
  });

  return messages;
}
