import {
  ATTRIBUTES,
  OPERATORS,
  STATUSES,
  VALUES,
  LOGICAL_OPERATORS,
  TIME_ATTRIBUTES,
  ID_ATTRIBUTES,
  COMPARISON_OPERATORS,
  TIME_FORMAT,
  TIME_FORMAT_BETWEEN,
  EQUALITY_OPERATORS,
  OPERATORS_TO_PRESERVE,
} from '../workflows-query-input.constants';
import type {
  Suggestion,
  OtherAttributeKey,
} from '../workflows-query-input.types';

export function getAutocompleteSuggestions(value: string): Suggestion[] {
  const tokens = value.trim().split(/\s+/);
  const lastToken = tokens[tokens.length - 1] || '';
  const prevToken = tokens[tokens.length - 2] || '';

  // attribute suggestions at start or after logical operators
  if (
    tokens.length === 1 ||
    LOGICAL_OPERATORS.includes(prevToken.toUpperCase())
  ) {
    return ATTRIBUTES.filter((name: string) =>
      name.toLowerCase().startsWith(lastToken.toLowerCase())
    ).map((name: string) => ({ name, type: 'ATTRIBUTE' }));
  }

  const attributeValueMap = {
    CloseStatus: STATUSES,
    Passed: VALUES,
    IsCron: VALUES,
  } as const;
  type AttributeValueKey = keyof typeof attributeValueMap;

  const isTimeAttribute = TIME_ATTRIBUTES.includes(prevToken);

  // time attribute with comparison operator
  if (
    isTimeAttribute &&
    COMPARISON_OPERATORS.some((op: string) => lastToken.startsWith(op))
  ) {
    return [
      {
        name: TIME_FORMAT,
        type: 'TIME',
      },
    ];
  } else if (
    isTimeAttribute &&
    ['BETWEEN'].some((op) => lastToken.startsWith(op))
  ) {
    return [
      {
        name: TIME_FORMAT_BETWEEN,
        type: 'TIME',
      },
    ];
  }

  const isIdAttribute = ID_ATTRIBUTES.includes(prevToken);
  if (
    isIdAttribute &&
    EQUALITY_OPERATORS.some((op: string) => lastToken.startsWith(op))
  ) {
    return [
      {
        name: '""',
        type: 'ID',
      },
    ];
  }

  // after 'CloseStatus' | 'Passed' | 'IsCron' attributes with or without space
  const foundAttr = Object.keys(attributeValueMap).find(
    (attr) =>
      (prevToken === attr && (lastToken === '=' || lastToken === '!=')) ||
      new RegExp(`^${attr}(!=|=)$`).test(lastToken)
  );
  if (foundAttr && foundAttr in attributeValueMap) {
    const attributeMatchStatusBoolean = foundAttr as AttributeValueKey;
    return attributeValueMap[attributeMatchStatusBoolean].map(
      (val: string) => ({
        name: val,
        type:
          attributeMatchStatusBoolean === 'CloseStatus' ? 'STATUS' : 'VALUE',
      })
    );
  }

  // Suggest logical operators after a complete value
  const lastTokenIsCompleteValue =
    (lastToken.startsWith('"') && lastToken.endsWith('"')) ||
    VALUES.includes(lastToken.toUpperCase());

  if (lastTokenIsCompleteValue) {
    return OPERATORS.map((name: string) => ({ name, type: 'OPERATOR' }));
  }

  // Default: no suggestions
  return [];
}
