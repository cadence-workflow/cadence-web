import { type FieldMeta } from '../markdown-context-provider/markdown-context-provider.types';

import parseFieldValue from './parse-field-value';

export default function getFieldVariables(
  fieldValues: Record<string, string> | undefined,
  fieldMeta: Record<string, FieldMeta> | undefined
): Record<string, string | number> {
  // A null prototype keeps a field named __proto__ as an own variable.
  const variables: Record<string, string | number> = Object.create(null);
  if (!fieldMeta) return variables;

  for (const name of Object.keys(fieldMeta)) {
    const raw =
      fieldValues && Object.hasOwn(fieldValues, name)
        ? fieldValues[name]
        : undefined;
    const value = parseFieldValue(raw, fieldMeta[name]);
    if (value !== undefined) {
      variables[name] = value;
    }
  }

  return variables;
}
