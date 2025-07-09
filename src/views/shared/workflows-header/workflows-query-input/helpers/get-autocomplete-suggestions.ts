import {
  ATTRIBUTES,
  LOGICAL_OPERATORS,
  TIME_ATTRIBUTES,
  ID_ATTRIBUTES,
  COMPARISON_OPERATORS,
  TIME_FORMAT,
  TIME_FORMAT_BETWEEN,
  EQUALITY_OPERATORS,
  STATUSES,
  CLOSE_STATUS_ATTRIBUTE,
  BOOLEAN_ATTRIBUTES,
  BOOLEAN_VALUES,
} from '../workflows-query-input.constants';

export default function getAutocompleteSuggestions(
  value: string
): Array<string> {
  const tokens = value.trim().split(/\s+/);
  const lastToken = tokens[tokens.length - 1] || '';
  const secondLastToken = tokens[tokens.length - 2] || '';

  // At query start or after logical operators: show attribute suggestions
  if (
    tokens.length === 1 ||
    LOGICAL_OPERATORS.includes(secondLastToken.toUpperCase())
  ) {
    return ATTRIBUTES.filter((name: string) =>
      name.toLowerCase().startsWith(lastToken.toLowerCase())
    );
  }

  // After time attributes and comparison operators: show time format templates
  const isTimeAttribute = TIME_ATTRIBUTES.includes(secondLastToken);

  if (
    isTimeAttribute &&
    COMPARISON_OPERATORS.some((op: string) => lastToken.startsWith(op))
  ) {
    return [TIME_FORMAT];
  } else if (
    isTimeAttribute &&
    ['BETWEEN'].some((op) => lastToken.startsWith(op))
  ) {
    return [TIME_FORMAT_BETWEEN];
  }

  // After ID attributes and equality operators: show empty quotes placeholder
  const isIdAttribute = ID_ATTRIBUTES.includes(secondLastToken);
  if (
    isIdAttribute &&
    EQUALITY_OPERATORS.some((op: string) => lastToken.startsWith(op))
  ) {
    return ['""'];
  }

  // After CloseStatus attribute with equality operators: show status values
  if (
    (secondLastToken === CLOSE_STATUS_ATTRIBUTE &&
      (lastToken === '=' || lastToken === '!=')) ||
    new RegExp(`^CloseStatus(!=|=)$`).test(lastToken)
  ) {
    return STATUSES;
  }

  // After Passed/IsCron attributes with equality operators: show boolean values
  const foundBooleanAttr = BOOLEAN_ATTRIBUTES.find(
    (attr) =>
      (secondLastToken === attr && (lastToken === '=' || lastToken === '!=')) ||
      new RegExp(`^${attr}(!=|=)$`).test(lastToken)
  );

  if (foundBooleanAttr) {
    return BOOLEAN_VALUES;
  }

  // After complete values: show logical operators
  const lastTokenIsCompleteValue =
    (lastToken.startsWith('"') && lastToken.endsWith('"')) ||
    BOOLEAN_VALUES.includes(lastToken.toUpperCase());

  if (lastTokenIsCompleteValue) {
    return LOGICAL_OPERATORS;
  }

  // Default: no suggestions
  return [];
}
