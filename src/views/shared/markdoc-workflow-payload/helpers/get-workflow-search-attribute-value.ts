import { type PrettyJsonValue } from '@/components/pretty-json/pretty-json.types';

export default function getWorkflowSearchAttributeValue(
  searchAttributes: Record<string, PrettyJsonValue> | undefined,
  name?: string
): PrettyJsonValue {
  if (!name) return searchAttributes;
  if (!searchAttributes || !Object.hasOwn(searchAttributes, name)) {
    return undefined;
  }
  return searchAttributes[name];
}
