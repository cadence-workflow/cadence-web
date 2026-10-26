import { type FieldMeta } from '../markdown-context-provider/markdown-context-provider.types';

import parseFieldValue from './parse-field-value';

export default function getMissingFields(
  names: string[],
  fieldValues: Record<string, string> | undefined,
  fieldMeta: Record<string, FieldMeta> | undefined
): string[] {
  return names.filter((name) => {
    if (!fieldMeta || !Object.hasOwn(fieldMeta, name)) return true;

    const meta = fieldMeta[name];
    if (!meta.required) return false;

    const raw =
      fieldValues && Object.hasOwn(fieldValues, name)
        ? fieldValues[name]
        : undefined;
    return parseFieldValue(raw, meta) === undefined;
  });
}
