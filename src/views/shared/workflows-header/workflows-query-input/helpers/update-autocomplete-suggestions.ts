import {
  VALUES,
  OPERATORS_TO_PRESERVE,
} from '../workflows-query-input.constants';

export function updateQueryTextWithSuggestion(
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
