import {
  BOOLEAN_VALUES,
  OPERATORS_TO_PRESERVE,
} from '../workflows-query-input.constants';

export default function getUpdatedQueryTextWithSuggestion(
  queryText: string,
  suggestion: string
) {
  // Tokenize the current query into individual words/terms
  const tokens = queryText.trim().split(/\s+/);
  const lastToken = tokens[tokens.length - 1] || '';

  // Determine if the last token represents a "complete" value that shouldn't be modified
  const lastTokenIsCompleteValue =
    (lastToken.startsWith('"') && lastToken.endsWith('"')) ||
    BOOLEAN_VALUES.includes(lastToken.toUpperCase());

  // APPEND MODE: Add suggestion after complete tokens
  // Triggered when last token is:
  // - An operator to preserve (=, !=, >, >=, <, <=, BETWEEN, AND)
  // - A complete value (string or boolean)
  if (
    OPERATORS_TO_PRESERVE.includes(lastToken.toUpperCase()) ||
    lastTokenIsCompleteValue
  ) {
    let newValue = tokens.join(' ');
    if (!newValue.endsWith(' ')) {
      newValue += ' ';
    }
    newValue += suggestion + ' ';
    return newValue;
  }

  // REPLACE MODE: Replace partial token with suggestion
  // Triggered when the last token appears to be incomplete/partially typed
  tokens.pop();
  let newValue = tokens.join(' ');
  if (newValue) {
    newValue += ' ';
  }
  newValue += suggestion + ' ';

  return newValue;
}
