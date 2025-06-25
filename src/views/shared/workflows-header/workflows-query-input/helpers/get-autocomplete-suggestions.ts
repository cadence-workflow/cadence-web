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
} from '../.autocompletes';
import type { Suggestion, AttributeKey } from '../workflows-query-input.types';

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

  const isTimeAttribute = TIME_ATTRIBUTES.includes(prevToken);

  // time attribute with comparison operator
  if (
    isTimeAttribute &&
    COMPARISON_OPERATORS.some((op) => lastToken.startsWith(op))
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
    EQUALITY_OPERATORS.some((op) => lastToken.startsWith(op))
  ) {
    return [
      {
        name: '""',
        type: 'ID',
      },
    ];
  }

  // after 'CloseStatus' | 'Passed' | 'IsCron' attributes with or without space
  const attributeMatchStatusBoolean = Object.keys(attributeValueMap).find(
    (attr) =>
      (prevToken === attr && (lastToken === '=' || lastToken === '!=')) ||
      new RegExp(`^${attr}(!=|=)$`).test(lastToken)
  ) as AttributeKey | undefined;

  if (attributeMatchStatusBoolean) {
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

export function onSuggestionSelected(
  { suggestion }: { suggestion: { name: string } },
  queryText: string,
  setQueryText: (value: string) => void
) {
  // Split current query
  const tokens = queryText.trim().split(/\s+/);
  const lastToken = tokens[tokens.length - 1] || '';

  // if last token is a complete value to be preserved
  const lastTokenIsCompleteValue =
    (lastToken.startsWith('"') && lastToken.endsWith('"')) ||
    VALUES.includes(lastToken.toUpperCase());

  // if the last token is operator OR a complete value, append suggestion
  if (
    OPERATORS_TO_PRESERVE.includes(lastToken.toUpperCase()) ||
    lastTokenIsCompleteValue
  ) {
    let newValue = tokens.join(' ');
    if (!newValue.endsWith(' ')) {
      newValue += ' ';
    }
    newValue += suggestion.name + ' ';
    setQueryText(newValue);
    return;
  }

  // replace the last token (the partial word)
  tokens.pop();
  let newValue = tokens.join(' ');
  if (newValue) {
    newValue += ' ';
  }
  newValue += suggestion.name + ' ';

  // Only update local state
  setQueryText(newValue);
}
