import { type FieldMeta } from '../markdown-context-provider/markdown-context-provider.types';

export default function parseFieldValue(
  raw: string | undefined,
  meta: FieldMeta
): string | number | undefined {
  if (raw === undefined || raw.trim() === '') return undefined;
  if (meta.type === 'number') {
    const value = Number(raw);
    return Number.isNaN(value) ? undefined : value;
  }
  return raw;
}
