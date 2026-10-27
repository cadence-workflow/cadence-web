import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';
import formatPayload from '@/utils/data-formatters/format-payload';

export default function getWorkflowSearchAttributes(
  indexedFields: Record<string, { data?: string | null }> | null | undefined
): Record<string, PrettyJsonValue> | undefined {
  const entries = Object.entries(indexedFields ?? {});
  if (!entries.length) return undefined;

  return Object.fromEntries(
    entries.map(([name, payload]) => [
      name,
      formatPayload(payload) as PrettyJsonValue,
    ])
  );
}
