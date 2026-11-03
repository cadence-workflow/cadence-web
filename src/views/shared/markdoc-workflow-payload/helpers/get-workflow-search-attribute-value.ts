export default function getWorkflowSearchAttributeValue(
  searchAttributes: Record<string, unknown> | undefined,
  name?: string
): unknown {
  if (!name) return searchAttributes;
  if (!searchAttributes || !Object.hasOwn(searchAttributes, name)) {
    return undefined;
  }
  return searchAttributes[name];
}
