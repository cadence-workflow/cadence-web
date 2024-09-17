export default function parseErrorMessageForQueryTypes(
  message: string
): Array<string> | undefined {
  const knownTypesErrorMatch = message.match(
    /(KnownQueryTypes|knownTypes)=\[(.*)?\]/
  );

  if (!knownTypesErrorMatch) {
    return undefined;
  }

  const queryTypes = knownTypesErrorMatch[2];

  return queryTypes ? queryTypes.split(/, | /).filter(Boolean) : [];
}
