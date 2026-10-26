import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import { type FieldMeta } from '../markdown-context-provider/markdown-context-provider.types';

export type ApplyFieldValuesResult = {
  input: unknown;
  missingRequired: string[];
};

export default function applyFieldValues(
  input: unknown,
  fields: Record<string, string> | undefined,
  fieldValues: Record<string, string> | undefined,
  fieldMeta: Record<string, FieldMeta> | undefined
): ApplyFieldValuesResult {
  let result: unknown = input === undefined ? undefined : cloneDeep(input);
  const missingRequired: string[] = [];

  for (const [path, fieldName] of Object.entries(fields ?? {})) {
    const meta =
      fieldMeta && Object.hasOwn(fieldMeta, fieldName)
        ? fieldMeta[fieldName]
        : undefined;
    if (!meta) {
      // No field defines this name, so sending the template value would be wrong.
      missingRequired.push(fieldName);
      continue;
    }

    const rawValue =
      fieldValues && Object.hasOwn(fieldValues, fieldName)
        ? fieldValues[fieldName]
        : '';
    const value = meta.type === 'number' ? Number(rawValue) : rawValue;
    const isMissing =
      rawValue.trim() === '' ||
      (typeof value === 'number' && Number.isNaN(value));

    if (isMissing) {
      if (meta.required) {
        missingRequired.push(fieldName);
      }
      continue;
    }

    if (result === undefined || result === null || typeof result !== 'object') {
      result = {};
    }
    set(result as object, path, value);
  }

  return { input: result, missingRequired };
}
